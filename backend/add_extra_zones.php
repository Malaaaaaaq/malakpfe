$parkings = App\Models\Parking::all();

foreach ($parkings as $p) {
    echo "Mise à jour du parking : " . $p->name . "\n";
    
    // Create Zone C if not exists
    if (!$p->zones()->where('name', 'Zone C')->exists()) {
        $z3 = $p->zones()->create(['name' => 'Zone C', 'level' => 2]);
        for ($i=1; $i<=12; $i++) {
            $z3->spots()->create([
                'code' => 'C-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'type' => 'standard',
                'price_per_hour' => 10,
                'status' => 'libre'
            ]);
        }
    }

    // Create Zone D if not exists
    if (!$p->zones()->where('name', 'Zone D')->exists()) {
        $z4 = $p->zones()->create(['name' => 'Zone D', 'level' => 2]);
        for ($i=1; $i<=12; $i++) {
            $z4->spots()->create([
                'code' => 'D-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'type' => 'standard',
                'price_per_hour' => 10,
                'status' => 'libre'
            ]);
        }
    }
}

echo "Zones C et D ajoutées avec succès !";
