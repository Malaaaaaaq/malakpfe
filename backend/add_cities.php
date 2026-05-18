$citiesData = [
    'Marrakech' => [
        ['name' => 'Parking Jemaa El-Fna', 'lat' => 31.6258, 'lng' => -7.9891, 'addr' => 'Place Jemaa El-Fna'],
        ['name' => 'Parking Gueliz', 'lat' => 31.6358, 'lng' => -8.0099, 'addr' => 'Av. Mohammed V, Gueliz'],
    ],
    'Tanger' => [
        ['name' => 'Parking Port de Tanger', 'lat' => 35.7888, 'lng' => -5.8138, 'addr' => 'Av. de la Résistance'],
        ['name' => 'Parking Iberia', 'lat' => 35.7735, 'lng' => -5.8088, 'addr' => 'Rue Ibn Zaidoun'],
    ],
    'Fès' => [
        ['name' => 'Parking Ville Nouvelle', 'lat' => 34.0374, 'lng' => -5.0010, 'addr' => 'Bd Mohammed V, Fès'],
        ['name' => 'Parking Médina', 'lat' => 34.0647, 'lng' => -4.9783, 'addr' => 'Bab Bou Jeloud'],
    ],
    'Agadir' => [
        ['name' => 'Parking Souss Massa', 'lat' => 30.4202, 'lng' => -9.5987, 'addr' => 'Bd Hassan II, Agadir'],
        ['name' => 'Parking Marina Agadir', 'lat' => 30.4165, 'lng' => -9.6110, 'addr' => 'Bd du 20 Août'],
    ]
];

foreach ($citiesData as $cityName => $parkings) {
    $city = App\Models\City::firstOrCreate(['name' => $cityName]);
    
    foreach ($parkings as $pData) {
        if (!App\Models\Parking::where('name', $pData['name'])->exists()) {
            $p = App\Models\Parking::create([
                'city_id' => $city->id,
                'name' => $pData['name'],
                'address' => $pData['addr'],
                'latitude' => $pData['lat'],
                'longitude' => $pData['lng'],
                'total_spots' => 100,
                'rating' => 4.5
            ]);
            
            // Add zones and spots for this new parking
            $z = $p->zones()->create(['name' => 'Zone A', 'level' => 1]);
            for ($i=1; $i<=10; $i++) {
                $z->spots()->create([
                    'code' => 'A-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'type' => 'standard',
                    'price_per_hour' => 10,
                    'status' => 'libre'
                ]);
            }
            echo "Parking " . $pData['name'] . " créé à " . $cityName . ".\n";
        }
    }
}

echo "Villes et parkings ajoutés !";
