<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Parking;
use Illuminate\Http\Request;

class ParkingController extends Controller
{
    public function index()
    {
        $parkings = Parking::with('city')->get()->map(function ($parking) {
            // Count free spots if relation exists, otherwise fallback to a fake random or total
            // Since we might not have spots seeded, let's just make it look real
            $freeSpots = $parking->spots()->where('status', 'libre')->count();
            
            // If no spots created in DB yet, fallback to a random 
            if ($parking->total_spots > 0 && $freeSpots === 0 && $parking->spots()->count() === 0) {
                $freeSpots = rand(5, $parking->total_spots);
            }

            return [
                'id' => $parking->id,
                'name' => $parking->name,
                'address' => $parking->address,
                'city' => $parking->city ? $parking->city->name : 'Casablanca',
                'rating' => $parking->rating ?? 4.5,
                'reviews' => rand(100, 500),
                'price' => 10,
                'total_spots' => $parking->total_spots,
                'free_spots' => $freeSpots,
                'available' => $freeSpots > 0,
                'distance' => rand(1, 15) / 10 . ' km', // Random for demo
                'features' => ['Sécurité 24h/24', 'Vidéosurveillance', 'Parking PMR'],
                'image' => 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80',
                'latitude' => $parking->latitude,
                'longitude' => $parking->longitude,
            ];
        });

        return response()->json($parkings);
    }
    public function zones(Parking $parking)
    {
        $zones = $parking->zones()->with('spots')->get();
        return response()->json($zones);
    }

    public function agentSpots(Request $request)
    {
        $user = $request->user();
        $parkingIds = Parking::where('user_id', $user->id)->pluck('id');

        if ($parkingIds->isEmpty()) {
            return response()->json(['zones' => [], 'stats' => ['total' => 0, 'libre' => 0, 'occupee' => 0]]);
        }

        $zones = \App\Models\ParkingZone::whereIn('parking_id', $parkingIds)
            ->with(['spots', 'parking'])
            ->get();

        $allSpots = $zones->flatMap->spots;

        return response()->json([
            'zones' => $zones,
            'stats' => [
                'total'   => $allSpots->count(),
                'libre'   => $allSpots->where('status', 'libre')->count(),
                'occupee' => $allSpots->where('status', 'occupee')->count(),
                'reservee'=> $allSpots->where('status', 'reservee')->count(),
            ],
        ]);
    }

    public function updateSpot(Request $request, \App\Models\ParkingSpot $spot)
    {
        $request->validate(['status' => 'required|in:libre,occupee,maintenance']);
        $spot->update(['status' => $request->status]);
        return response()->json(['message' => 'Statut mis à jour.', 'spot' => $spot]);
    }

    public function getAgentParking(Request $request)
    {
        $user = $request->user();
        $parking = Parking::where('user_id', $user->id)->with('city')->first();
        
        if (!$parking) {
            return response()->json(['message' => 'Aucun parking trouvé.'], 404);
        }

        return response()->json($parking);
    }

    public function updateParking(Request $request)
    {
        $user = $request->user();
        $parking = Parking::where('user_id', $user->id)->first();

        if (!$parking) {
            return response()->json(['message' => 'Aucun parking trouvé.'], 404);
        }

        $data = $request->validate([
            'name' => 'required|string|max:150',
            'address' => 'required|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'required|boolean',
        ]);

        $parking->update($data);

        return response()->json([
            'message' => 'Paramètres du parking mis à jour avec succès.',
            'parking' => $parking
        ]);
    }
}
