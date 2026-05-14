<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
        ]);

        $user = User::create([
            'firstname' => $data['firstname'],
            'lastname'  => $data['lastname'] ?? null,
            'email'     => $data['email'],
            'phone'     => $data['phone'] ?? null,
            'role'      => $data['role'] ?? 'client',
            'password'  => Hash::make($data['password']),
        ]);

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
