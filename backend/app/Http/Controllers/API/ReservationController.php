<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $reservations = $request->user()
            ->reservations()
            ->with('vehicle')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'             => $r->id,
                'reference'      => $r->reference,
                'status'         => $r->status,
                'entry_date'     => $r->entry_date?->format('d/m/Y'),
                'entry_time'     => $r->entry_time,
                'exit_time'      => $r->exit_time,
                'duration_hours' => $r->duration_hours,
                'total_price'    => $r->total_price,
                'spot_code'      => $r->spot_code,
                'parking'        => $r->parking_name,
                'city'           => $r->city_name,
                'vehicle'        => $r->vehicle
                    ? $r->vehicle->plate . ' – ' . $r->vehicle->make . ' ' . $r->vehicle->model
                    : null,
                'qr_token'       => $r->qr_token,
            ]);

        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vehicle_id'     => 'required|exists:vehicles,id',
            'spot_code'      => 'required|string|max:20',
            'parking_name'   => 'required|string|max:150',
            'city_name'      => 'required|string|max:100',
            'entry_date'     => 'required|date',
            'entry_time'     => 'required|string',
            'exit_time'      => 'required|string',
            'duration_hours' => 'required|numeric|min:0.25',
            'total_price'    => 'required|numeric|min:0',
        ]);

        // Verify vehicle belongs to user
        if (!$request->user()->vehicles()->find($data['vehicle_id'])) {
            return response()->json(['message' => 'Véhicule invalide.'], 403);
        }

        $reservation = Reservation::create([
            'reference'      => 'PRK-' . date('Y') . '-' . strtoupper(Str::random(6)),
            'user_id'        => $request->user()->id,
            'vehicle_id'     => $data['vehicle_id'],
            'spot_code'      => $data['spot_code'],
            'parking_name'   => $data['parking_name'],
            'city_name'      => $data['city_name'],
            'entry_date'     => $data['entry_date'],
            'entry_time'     => $data['entry_time'],
            'exit_time'      => $data['exit_time'],
            'duration_hours' => $data['duration_hours'],
            'total_price'    => $data['total_price'],
            'status'         => 'upcoming',
            'qr_token'       => Str::uuid(),
        ]);

        return response()->json([
            'reservation' => $reservation,
            'reference'   => $reservation->reference,
        ], 201);
    }

    public function cancel(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($reservation->status !== 'upcoming') {
            return response()->json(['message' => 'Impossible d\'annuler cette réservation.'], 422);
        }

        $reservation->update(['status' => 'cancelled']);

        // Free the spot again
        if ($reservation->spot) {
            $reservation->spot->update(['status' => 'libre']);
        }

        return response()->json(['message' => 'Réservation annulée.']);
    }
}
