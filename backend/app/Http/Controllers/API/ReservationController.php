<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Parking;
use App\Models\ParkingSpot;
use App\Mail\ReservationConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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

        $parkingId = $request->input('parking_id');
        $realSpotId = null;

        if ($parkingId) {
            // Find a spot in this parking with the same code
            $spot = \App\Models\ParkingSpot::where('code', $data['spot_code'])
                ->whereHas('zone', function($q) use ($parkingId) {
                    $q->where('parking_id', $parkingId);
                })
                ->first();
            
            if ($spot) {
                $realSpotId = $spot->id;
                // Mark as occupied for demo
                $spot->update(['status' => 'occupee']);
            }
        }

        $reservation = Reservation::create([
            'reference'      => 'PRK-' . date('Y') . '-' . strtoupper(Str::random(6)),
            'user_id'        => $request->user()->id,
            'vehicle_id'     => $data['vehicle_id'],
            'spot_id'        => $realSpotId,
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

        // Send confirmation email
        try {
            Mail::to($request->user()->email)->send(new ReservationConfirmed($reservation));
        } catch (\Exception $e) {
            // On ignore l'erreur d'envoi pour ne pas bloquer la réservation
            \Illuminate\Support\Facades\Log::error("Erreur envoi email réservation: " . $e->getMessage());
        }

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

    public function agentReservations(Request $request)
    {
        $user = $request->user();
        
        // On récupère tous les IDs des parkings possédés par cet agent
        $parkingIds = Parking::where('user_id', $user->id)->pluck('id');

        if ($parkingIds->isEmpty()) {
            return response()->json([
                'message' => 'Aucun parking associé à cet agent.',
                'reservations' => [],
                'stats' => [
                    'total_spots' => 0,
                    'free_spots' => 0,
                    'today_count' => 0,
                    'upcoming_count' => 0
                ]
            ]);
        }

        // Toutes les réservations pour TOUS les parkings de l'agent
        $reservations = Reservation::whereHas('spot.zone', function ($query) use ($parkingIds) {
            $query->whereIn('parking_id', $parkingIds);
        })->with(['user', 'vehicle', 'spot.zone.parking'])->latest()->get();

        // Statistiques cumulées
        $stats = [
            'total_spots' => ParkingSpot::whereHas('zone', function($q) use ($parkingIds){
                $q->whereIn('parking_id', $parkingIds);
            })->count(),
            'free_spots' => ParkingSpot::whereHas('zone', function($q) use ($parkingIds){
                $q->whereIn('parking_id', $parkingIds);
            })->where('status', 'libre')->count(),
            'today_count' => Reservation::whereHas('spot.zone', function ($q) use ($parkingIds) {
                $q->whereIn('parking_id', $parkingIds);
            })->whereDate('entry_date', now())->count(),
            'upcoming_count' => Reservation::whereHas('spot.zone', function ($q) use ($parkingIds) {
                $q->whereIn('parking_id', $parkingIds);
            })->where('status', 'upcoming')->count(),
        ];

        return response()->json([
            'reservations' => $reservations,
            'stats' => $stats
        ]);
    }

    public function confirm(Request $request, Reservation $reservation)
    {
        $user = $request->user();
        if ($user->role !== 'agent') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $reservation->update(['status' => 'confirmed']);

        if ($reservation->spot) {
            $reservation->spot->update(['status' => 'occupee']);
        }

        return response()->json(['message' => 'Réservation confirmée avec succès.', 'reservation' => $reservation]);
    }

    public function refuse(Request $request, Reservation $reservation)
    {
        $user = $request->user();
        if ($user->role !== 'agent') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $reservation->update(['status' => 'refused']);

        if ($reservation->spot) {
            $reservation->spot->update(['status' => 'libre']);
        }

        return response()->json(['message' => 'Réservation refusée. La place a été libérée.', 'reservation' => $reservation]);
    }
}
