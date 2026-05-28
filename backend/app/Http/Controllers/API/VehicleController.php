<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->vehicles()->orderBy('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'plate' => 'required|string|max:20',
            'make'  => 'required|string|max:50',
            'model' => 'required|string|max:50',
            'color' => 'nullable|string|max:30',
            'type'  => 'nullable|string|max:30',
        ]);

        $vehicle = $request->user()->vehicles()->create($data);

        return response()->json($vehicle, 201);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'plate' => 'required|string|max:20',
            'make'  => 'required|string|max:50',
            'model' => 'required|string|max:50',
            'color' => 'nullable|string|max:30',
            'type'  => 'nullable|string|max:30',
        ]);

        $vehicle->update($data);

        return response()->json($vehicle);
    }

    public function destroy(Request $request, Vehicle $vehicle)
    {
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $vehicle->delete();

        return response()->json(['message' => 'Véhicule supprimé.']);
    }
}
