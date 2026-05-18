// Script de configuration professionnelle

echo "=== NETTOYAGE DES COMPTES NON PROFESSIONNELS ===\n\n";

// 1. Supprimer les comptes non professionnels
$nonPro = ['test@gmail.com', 'hhhhhhh@gmail.com'];
foreach ($nonPro as $email) {
    $user = App\Models\User::where('email', $email)->first();
    if ($user) {
        $parkings = App\Models\Parking::where('user_id', $user->id)->get();
        foreach ($parkings as $p) {
            foreach ($p->zones as $z) {
                foreach ($z->spots as $s) {
                    $s->reservations()->delete();
                }
                $z->spots()->delete();
            }
            $p->zones()->delete();
            $p->delete();
        }
        $user->delete();
        echo "✅ Supprimé: $email\n";
    }
}

echo "\n=== CRÉATION DES AGENTS PROFESSIONNELS ===\n\n";

// Helper function to create zones and spots
function createParkingInfra($parking, $spotsPerZone = 12) {
    $zones = [
        ['name' => 'Zone A', 'level' => 1, 'types' => ['standard', 'standard', 'standard', 'electrique']],
        ['name' => 'Zone B', 'level' => 1, 'types' => ['standard', 'standard', 'vip', 'standard']],
        ['name' => 'Zone C', 'level' => 2, 'types' => ['standard', 'standard', 'standard', 'standard']],
        ['name' => 'Zone D', 'level' => 2, 'types' => ['handicap', 'standard', 'standard', 'moto']],
    ];
    
    foreach ($zones as $zoneData) {
        $zone = $parking->zones()->create([
            'name' => $zoneData['name'],
            'level' => $zoneData['level'],
        ]);
        
        for ($i = 1; $i <= $spotsPerZone; $i++) {
            $typeIdx = ($i - 1) % count($zoneData['types']);
            $type = $zoneData['types'][$typeIdx];
            $price = match($type) {
                'vip' => 20,
                'electrique' => 15,
                'handicap' => 8,
                'moto' => 6,
                default => 10,
            };
            $zone->spots()->create([
                'code' => substr($zoneData['name'], -1) . '-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'type' => $type,
                'price_per_hour' => $price,
                'status' => 'libre',
            ]);
        }
    }
    echo "   ✅ 4 zones + " . (count($zones) * $spotsPerZone) . " places créées\n";
}

// 2. Créer les nouveaux agents professionnels avec leurs parkings
$newAgents = [
    [
        'firstname' => 'Karima',
        'lastname' => 'Idrissi',
        'email' => 'karima.idrissi@parlak.ma',
        'phone' => '06 12 34 56 78',
        'parking' => [
            'name' => 'Twin Center Parking',
            'city_id' => 1, // Casablanca
            'address' => 'Bd Zerktouni, Maarif, Casablanca',
            'latitude' => 33.5867,
            'longitude' => -7.6430,
        ]
    ],
    [
        'firstname' => 'Hassan',
        'lastname' => 'Moukrim',
        'email' => 'hassan.moukrim@parlak.ma',
        'phone' => '06 23 45 67 89',
        'parking' => [
            'name' => 'Parking Agdal Center',
            'city_id' => 2, // Rabat
            'address' => 'Av. Al Amir Fal Ould Omeir, Agdal, Rabat',
            'latitude' => 33.9857,
            'longitude' => -6.8509,
        ]
    ],
    [
        'firstname' => 'Sofia',
        'lastname' => 'Alaoui',
        'email' => 'sofia.alaoui@parlak.ma',
        'phone' => '06 34 56 78 90',
        'parking' => [
            'name' => 'Parking Gueliz Premium',
            'city_id' => 3, // Marrakech
            'address' => 'Av. Mohammed V, Gueliz, Marrakech',
            'latitude' => 31.6358,
            'longitude' => -8.0099,
        ]
    ],
    [
        'firstname' => 'Omar',
        'lastname' => 'Tahiri',
        'email' => 'omar.tahiri@parlak.ma',
        'phone' => '06 45 67 89 01',
        'parking' => [
            'name' => 'Parking Port Tanger Marina',
            'city_id' => 4, // Tanger
            'address' => 'Av. de la Résistance, Tanger',
            'latitude' => 35.7888,
            'longitude' => -5.8138,
        ]
    ],
    [
        'firstname' => 'Nadia',
        'lastname' => 'Berrada',
        'email' => 'nadia.berrada@parlak.ma',
        'phone' => '06 56 78 90 12',
        'parking' => [
            'name' => 'Parking Médina Fès',
            'city_id' => 5, // Fès
            'address' => 'Bab Bou Jeloud, Fès',
            'latitude' => 34.0647,
            'longitude' => -4.9783,
        ]
    ],
];

foreach ($newAgents as $agentData) {
    // Check if already exists
    if (User::where('email', $agentData['email'])->exists()) {
        echo "Agent {$agentData['email']} existe déjà, ignoré.\n";
        continue;
    }

    $user = App\Models\User::create([
        'firstname' => $agentData['firstname'],
        'lastname' => $agentData['lastname'],
        'email' => $agentData['email'],
        'phone' => $agentData['phone'],
        'role' => 'agent',
        'parking_name' => $agentData['parking']['name'],
        'password' => Illuminate\Support\Facades\Hash::make('Parlak@2025'),
    ]);

    $parkingData = $agentData['parking'];
    $parking = App\Models\Parking::create([
        'user_id' => $user->id,
        'city_id' => $parkingData['city_id'],
        'name' => $parkingData['name'],
        'address' => $parkingData['address'],
        'latitude' => $parkingData['latitude'],
        'longitude' => $parkingData['longitude'],
        'total_spots' => 48,
        'rating' => 4.5,
        'is_active' => true,
    ]);

    echo "✅ Agent créé: {$agentData['firstname']} {$agentData['lastname']} ({$agentData['email']})\n";
    echo "   -> Parking: {$parkingData['name']}\n";
    createParkingInfra($parking);
    echo "\n";
}

echo "\n=== ÉTAT FINAL DU SYSTÈME ===\n\n";
$agents = App\Models\User::where('role', 'agent')->get();
foreach ($agents as $agent) {
    $parkings = App\Models\Parking::where('user_id', $agent->id)->get();
    $spots = 0;
    foreach ($parkings as $p) { $spots += $p->spots()->count(); }
    echo "✅ {$agent->firstname} {$agent->lastname} ({$agent->email})\n";
    foreach ($parkings as $p) {
        echo "   -> {$p->name} (" . $p->spots()->count() . " places)\n";
    }
}
echo "\n=== TERMINÉ ===\n";

