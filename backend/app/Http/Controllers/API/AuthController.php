<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Parking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeNewsletter;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'firstname' => 'required|string|max:100',
            'lastname'  => 'nullable|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'phone'     => 'nullable|string|max:20',
            'password'  => ['required', 'confirmed', Password::min(6)],
            'role'      => 'in:client,agent,admin',
            'latitude'     => 'nullable|numeric',
            'longitude'    => 'nullable|numeric',
            'parking_name' => 'nullable|string|max:150',
            'city_id'      => 'nullable|integer',
            'total_spots'  => 'nullable|integer|min:4|max:200',
        ]);

        $user = User::create([
            'firstname' => $data['firstname'],
            'lastname'  => $data['lastname'] ?? null,
            'email'     => $data['email'],
            'phone'     => $data['phone'] ?? null,
            'role'      => $data['role'] ?? 'client',
            'parking_name' => $data['parking_name'] ?? null,
            'latitude'  => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'password'  => Hash::make($data['password']),
        ]);

        // Si c'est un agent, on crée automatiquement son parking avec ses zones
        if ($user->role === 'agent' && isset($data['parking_name'])) {
            $totalSpots = intval($data['total_spots'] ?? 40);

            $parking = Parking::create([
                'user_id' => $user->id,
                'city_id' => $data['city_id'] ?? 1,
                'name'    => $data['parking_name'],
                'address' => "Adresse à préciser",
                'latitude'  => $data['latitude'],
                'longitude' => $data['longitude'],
                'total_spots' => $totalSpots,
                'is_active'   => true,
            ]);

            // Répartition des places sur 4 zones
            $spotsPerZone = intval($totalSpots / 4);
            $remainder = $totalSpots % 4;

            $zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
            foreach ($zones as $index => $zoneName) {
                $z = $parking->zones()->create([
                    'name' => $zoneName,
                    'level' => $index < 2 ? 1 : 2
                ]);

                $count = $spotsPerZone + ($index === 3 ? $remainder : 0);

                for ($i = 1; $i <= $count; $i++) {
                    $z->spots()->create([
                        'code' => substr($zoneName, -1) . '-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                        'type' => 'standard',
                        'price_per_hour' => 10,
                        'status' => 'libre'
                    ]);
                }
            }
        }

        // Envoi de l'email de bienvenue avec gestion d'erreur pour ne pas bloquer l'inscription
        try {
            Mail::to($user->email)->send(new WelcomeNewsletter($user->firstname));
        } catch (\Exception $e) {
            // On continue sans bloquer
            \Illuminate\Support\Facades\Log::error("Erreur envoi email inscription: " . $e->getMessage());
        }

        $token = $user->createToken('parlak-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login and return a token.
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        // Revoke old tokens and create a fresh one
        $user->tokens()->delete();
        $token = $user->createToken('parlak-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Logout (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}
