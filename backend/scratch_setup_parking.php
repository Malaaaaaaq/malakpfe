$p = App\Models\Parking::create([
    'user_id' => 10,
    'city_id' => 1,
    'name' => 'ouled hado',
    'address' => 'Adresse Ouled Haddo',
    'latitude' => 33.5646,
    'longitude' => -7.6197,
    'total_spots' => 120
]);

$z = $p->zones()->create(['name' => 'Zone A', 'level' => 1]);

for($i=1; $i<=10; $i++) {
    $z->spots()->create([
        'code' => 'A-'.str_pad($i, 2, '0', STR_PAD_LEFT),
        'type' => 'standard',
        'price_per_hour' => 10,
        'status' => 'libre'
    ]);
}

echo "Parking ouled hado créé avec succès pour l'user 10.";
