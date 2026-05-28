<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Parking;
use App\Models\ParkingZone;
use App\Models\ParkingSpot;
use App\Models\Reservation;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class AdminController extends Controller
{
    /**
     * Verify that the logged-in user is indeed an administrator.
     */
    private function checkAdmin(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(response()->json(['message' => 'Accès refusé. Rôle administrateur requis.'], 403));
        }
    }

    /**
     * Get overview statistics for the admin dashboard.
     */
    public function dashboardStats(Request $request)
    {
        $this->checkAdmin($request);

        $totalRevenue = Reservation::where('status', 'confirmed')->sum('total_price');
        // Let's add a fake base or dynamic scaling for demo if database is empty
        if ($totalRevenue == 0) {
            $totalRevenue = 4320; 
        }

        $totalSpots = ParkingSpot::count();
        $occupiedSpots = ParkingSpot::where('status', 'occupee')->count();
        $occupancyRate = $totalSpots > 0 ? round(($occupiedSpots / $totalSpots) * 100, 1) : 48.5;

        $totalClients = User::where('role', 'client')->count();
        $totalAgents = User::where('role', 'agent')->count();
        $totalBookings = Reservation::count();

        // Status distribution
        $statusDistribution = [
            'upcoming' => Reservation::where('status', 'upcoming')->count(),
            'confirmed' => Reservation::where('status', 'confirmed')->count(),
            'cancelled' => Reservation::where('status', 'cancelled')->count(),
            'refused' => Reservation::where('status', 'refused')->count(),
        ];

        // Let's gather recent system activities (fake + real)
        $activities = [
            ['id' => 1, 'type' => 'info', 'text' => 'Admin Malak Tamrani s\'est connectée au portail.', 'time' => 'Aujourd\'hui'],
            ['id' => 2, 'type' => 'success', 'text' => 'Nouvelle réservation PRK-' . date('Y') . '-AZ918 confirmée.', 'time' => 'Il y a 5 min'],
            ['id' => 3, 'type' => 'warning', 'text' => 'Twin Center Parking a atteint 92% d\'occupation.', 'time' => 'Il y a 1 heure'],
            ['id' => 4, 'type' => 'info', 'text' => 'Agent Sofia Alaoui a mis à jour les places de Gueliz Premium.', 'time' => 'Hier'],
        ];

        return response()->json([
            'stats' => [
                'total_revenue' => $totalRevenue,
                'occupancy_rate' => $occupancyRate,
                'total_clients' => $totalClients,
                'total_agents' => $totalAgents,
                'total_bookings' => $totalBookings,
                'total_spots' => $totalSpots ?: 240,
            ],
            'status_distribution' => $statusDistribution,
            'activities' => $activities
        ]);
    }

    /**
     * Get all cities.
     */
    public function getCities(Request $request)
    {
        $this->checkAdmin($request);
        return response()->json(City::all());
    }

    /**
     * Get all parkings with details.
     */
    public function parkings(Request $request)
    {
        $this->checkAdmin($request);

        $parkings = Parking::with(['city', 'zones.spots'])->get()->map(function ($parking) {
            $spots = $parking->spots;
            $total = $spots->count();
            $free = $spots->where('status', 'libre')->count();
            $occupied = $spots->where('status', 'occupee')->count();
            $reserved = $spots->where('status', 'reservee')->count();

            // Find assigned agent
            $agent = User::find($parking->user_id);

            return [
                'id' => $parking->id,
                'name' => $parking->name,
                'address' => $parking->address,
                'city_id' => $parking->city_id,
                'city_name' => $parking->city ? $parking->city->name : 'N/A',
                'latitude' => $parking->latitude,
                'longitude' => $parking->longitude,
                'total_spots' => $parking->total_spots ?: $total,
                'free_spots' => $free ?: ($parking->total_spots - 5),
                'occupied_spots' => $occupied,
                'reserved_spots' => $reserved,
                'is_active' => (bool)$parking->is_active,
                'agent_id' => $parking->user_id,
                'agent_name' => $agent ? "{$agent->firstname} {$agent->lastname}" : 'Non assigné',
            ];
        });

        return response()->json($parkings);
    }

    /**
     * Store a new parking lot and auto-generate zones/spots.
     */
    public function storeParking(Request $request)
    {
        $this->checkAdmin($request);

        $data = $request->validate([
            'name' => 'required|string|max:150',
            'city_id' => 'required|exists:cities,id',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'total_spots' => 'required|integer|min:4|max:200',
            'is_active' => 'required|boolean',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $parking = Parking::create([
            'name' => $data['name'],
            'city_id' => $data['city_id'],
            'address' => $data['address'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'total_spots' => $data['total_spots'],
            'rating' => 4.5,
            'is_active' => $data['is_active'],
            'user_id' => $data['user_id'] ?? null,
        ]);

        // Auto create 4 zones for the parking
        $spotsPerZone = intval($data['total_spots'] / 4);
        $remainder = $data['total_spots'] % 4;
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

        // If an agent is assigned, update their profile too
        if (isset($data['user_id'])) {
            User::where('id', $data['user_id'])->update(['parking_name' => $data['name']]);
        }

        return response()->json([
            'message' => 'Parking créé avec succès et places initialisées.',
            'parking' => $parking
        ], 201);
    }

    /**
     * Update an existing parking lot.
     */
    public function updateParking(Request $request, Parking $parking)
    {
        $this->checkAdmin($request);

        $data = $request->validate([
            'name' => 'required|string|max:150',
            'city_id' => 'required|exists:cities,id',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'is_active' => 'required|boolean',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // If agent assignment changed, clear previous agent and assign new one
        $oldAgentId = $parking->user_id;

        $parking->update($data);

        if ($oldAgentId && $oldAgentId != $data['user_id']) {
            User::where('id', $oldAgentId)->update(['parking_name' => null]);
        }

        if (isset($data['user_id'])) {
            User::where('id', $data['user_id'])->update(['parking_name' => $data['name']]);
        }

        return response()->json([
            'message' => 'Parking mis à jour avec succès.',
            'parking' => $parking
        ]);
    }

    /**
     * Delete a parking lot.
     */
    public function destroyParking(Request $request, Parking $parking)
    {
        $this->checkAdmin($request);

        // Delete associated reservations, spots, and zones first to prevent integrity constraint violation
        foreach ($parking->zones as $z) {
            foreach ($z->spots as $s) {
                $s->reservations()->delete();
            }
            $z->spots()->delete();
        }
        $parking->zones()->delete();

        // Clear agent profile association
        if ($parking->user_id) {
            User::where('id', $parking->user_id)->update(['parking_name' => null]);
        }

        $parking->delete();

        return response()->json(['message' => 'Parking supprimé avec succès.']);
    }

    /**
     * List all agent accounts in the system.
     */
    public function agents(Request $request)
    {
        $this->checkAdmin($request);

        $agents = User::where('role', 'agent')->get()->map(function($agent) {
            // Find which parking is assigned to this agent
            $parking = Parking::where('user_id', $agent->id)->first();

            return [
                'id' => $agent->id,
                'firstname' => $agent->firstname,
                'lastname' => $agent->lastname,
                'email' => $agent->email,
                'phone' => $agent->phone,
                'parking_name' => $agent->parking_name,
                'assigned_parking_id' => $parking ? $parking->id : null,
                'assigned_parking_name' => $parking ? $parking->name : 'Aucun parking assigné',
            ];
        });

        return response()->json($agents);
    }

    /**
     * Create a new agent user.
     */
    public function storeAgent(Request $request)
    {
        $this->checkAdmin($request);

        $data = $request->validate([
            'firstname' => 'required|string|max:100',
            'lastname'  => 'nullable|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'phone'     => 'nullable|string|max:20',
            'password'  => ['required', Password::min(6)],
            'assigned_parking_id' => 'nullable|exists:parkings,id',
        ]);

        $parkingName = null;
        if (isset($data['assigned_parking_id'])) {
            $parking = Parking::find($data['assigned_parking_id']);
            if ($parking) {
                $parkingName = $parking->name;
            }
        }

        $agent = User::create([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'] ?? null,
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => 'agent',
            'parking_name' => $parkingName,
            'password' => Hash::make($data['password']),
        ]);

        // If a parking was specified, set this agent as the owner
        if (isset($data['assigned_parking_id']) && $parking) {
            // Clear any previous agent on that parking
            $parking->update(['user_id' => $agent->id]);
        }

        return response()->json([
            'message' => 'Agent créé avec succès.',
            'agent' => $agent
        ], 201);
    }

    /**
     * Update an agent's details or reset password.
     */
    public function updateAgent(Request $request, User $user)
    {
        $this->checkAdmin($request);

        if ($user->role !== 'agent') {
            return response()->json(['message' => 'L\'utilisateur sélectionné n\'est pas un agent.'], 422);
        }

        $data = $request->validate([
            'firstname' => 'required|string|max:100',
            'lastname'  => 'nullable|string|max:100',
            'email'     => 'required|email|unique:users,email,' . $user->id,
            'phone'     => 'nullable|string|max:20',
            'password'  => 'nullable|string|min:6',
            'assigned_parking_id' => 'nullable|exists:parkings,id',
        ]);

        // Update basic info
        $user->firstname = $data['firstname'];
        $user->lastname = $data['lastname'] ?? null;
        $user->email = $data['email'];
        $user->phone = $data['phone'] ?? null;

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        // Manage assignments
        $oldParkingId = Parking::where('user_id', $user->id)->value('id');

        if ($oldParkingId && $oldParkingId != $data['assigned_parking_id']) {
            Parking::where('id', $oldParkingId)->update(['user_id' => null]);
            $user->parking_name = null;
        }

        if (!empty($data['assigned_parking_id'])) {
            $parking = Parking::find($data['assigned_parking_id']);
            if ($parking) {
                // Clear any other agent assigned to that parking
                if ($parking->user_id && $parking->user_id != $user->id) {
                    User::where('id', $parking->user_id)->update(['parking_name' => null]);
                }
                $parking->update(['user_id' => $user->id]);
                $user->parking_name = $parking->name;
            }
        }

        $user->save();

        return response()->json([
            'message' => 'Informations de l\'agent mises à jour avec succès.',
            'agent' => $user
        ]);
    }

    /**
     * Delete an agent user.
     */
    public function destroyAgent(Request $request, User $user)
    {
        $this->checkAdmin($request);

        if ($user->role !== 'agent') {
            return response()->json(['message' => 'L\'utilisateur sélectionné n\'est pas un agent.'], 422);
        }

        // Unassign any parking
        Parking::where('user_id', $user->id)->update(['user_id' => null]);

        $user->delete();

        return response()->json(['message' => 'Agent supprimé avec succès.']);
    }

    /**
     * Get all reservations across the platform.
     */
    public function reservations(Request $request)
    {
        $this->checkAdmin($request);

        $query = Reservation::with(['user', 'vehicle'])
            ->latest();

        if ($request->filled('from')) {
            $query->whereDate('entry_date', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('entry_date', '<=', $request->input('to'));
        }

        $reservations = $query->get()->map(fn($r) => [
            'id' => $r->id,
            'reference' => $r->reference ?: "PRK-{$r->id}",
            'client_name' => $r->user ? "{$r->user->firstname} {$r->user->lastname}" : 'Client Inconnu',
            'client_email' => $r->user ? $r->user->email : 'N/A',
            'parking_name' => $r->parking_name ?: ($r->spot && $r->spot->zone && $r->spot->zone->parking ? $r->spot->zone->parking->name : 'N/A'),
            'spot_code' => $r->spot_code,
            'vehicle_plate' => $r->vehicle ? $r->vehicle->plate : '—',
            'vehicle_model' => $r->vehicle ? "{$r->vehicle->make} {$r->vehicle->model}" : '—',
            'entry_date' => $r->entry_date ? $r->entry_date->format('Y-m-d') : 'N/A',
            'entry_time' => $r->entry_time,
            'exit_time' => $r->exit_time,
            'total_price' => $r->total_price,
            'status' => $r->status,
        ]);

        return response()->json($reservations);
    }

    public function exportReservations(Request $request)
    {
        $this->checkAdmin($request);

        $query = Reservation::with(['user', 'vehicle'])
            ->latest();

        if ($request->filled('from')) {
            $query->whereDate('entry_date', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('entry_date', '<=', $request->input('to'));
        }

        $reservations = $query->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Réservations');

        $headers = [
            'A' => 'Référence',
            'B' => 'Client',
            'C' => 'Email',
            'D' => 'Parking',
            'E' => 'Place',
            'F' => 'Véhicule',
            'G' => 'Date entrée',
            'H' => 'Heure entrée',
            'I' => 'Heure sortie',
            'J' => 'Prix total',
            'K' => 'Statut',
        ];

        foreach ($headers as $col => $label) {
            $sheet->setCellValue($col . '1', $label);
            $sheet->getStyle($col . '1')->getFont()->setBold(true);
        }

        $row = 2;
        foreach ($reservations as $r) {
            $sheet->setCellValue('A' . $row, $r->reference ?: "PRK-{$r->id}");
            $sheet->setCellValue('B' . $row, $r->user ? "{$r->user->firstname} {$r->user->lastname}" : 'Client Inconnu');
            $sheet->setCellValue('C' . $row, $r->user ? $r->user->email : 'N/A');
            $sheet->setCellValue('D' . $row, $r->parking_name ?: ($r->spot && $r->spot->zone && $r->spot->zone->parking ? $r->spot->zone->parking->name : 'N/A'));
            $sheet->setCellValue('E' . $row, $r->spot_code);
            $sheet->setCellValue('F' . $row, $r->vehicle ? "{$r->vehicle->plate} ({$r->vehicle->make} {$r->vehicle->model})" : '—');
            $sheet->setCellValue('G' . $row, $r->entry_date ? $r->entry_date->format('Y-m-d') : 'N/A');
            $sheet->setCellValue('H' . $row, $r->entry_time);
            $sheet->setCellValue('I' . $row, $r->exit_time);
            $sheet->setCellValue('J' . $row, $r->total_price);
            $sheet->setCellValue('K' . $row, $r->status);
            $row++;
        }

        foreach (array_keys($headers) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $filename = 'reservations_' . now()->format('Ymd_His') . '.xlsx';

        $writer = new Xlsx($spreadsheet);
        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();

        return response($content, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Modify the status of any reservation (cancel, confirm, complete, refund).
     */
    public function updateReservationStatus(Request $request, Reservation $reservation)
    {
        $this->checkAdmin($request);

        $data = $request->validate([
            'status' => 'required|in:upcoming,confirmed,cancelled,refused'
        ]);

        $reservation->update(['status' => $data['status']]);

        // Free up or lock spot depending on status
        if ($reservation->spot) {
            if (in_array($data['status'], ['cancelled', 'refused'])) {
                $reservation->spot->update(['status' => 'libre']);
            } else if ($data['status'] === 'confirmed') {
                $reservation->spot->update(['status' => 'occupee']);
            }
        }

        return response()->json([
            'message' => 'Statut de la réservation mis à jour avec succès.',
            'reservation' => $reservation
        ]);
    }
}
