$parkings = App\Models\Parking::all();

foreach ($parkings as $p) {
    // Check if parking already has zones
    if ($p->zones()->count() === 0) {
        echo "Peuplement du parking : " . $p->name . "\n";
        
        // Create Zone A
        $z1 = $p->zones()->create(['name' => 'Zone A', 'level' => 1]);
        for ($i=1; $i<=15; $i++) {
            $z1->spots()->create([
                'code' => 'A-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'type' => $i > 12 ? 'vip' : ($i > 10 ? 'electrique' : 'standard'),
                'price_per_hour' => $i > 12 ? 15 : 10,
                'status' => 'libre'
            ]);
        }

        // Create Zone B
        $z2 = $p->zones()->create(['name' => 'Zone B', 'level' => 1]);
        for ($i=1; $i<=15; $i++) {
            $z2->spots()->create([
                'code' => 'B-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'type' => $i > 12 ? 'handicap' : 'standard',
                'price_per_hour' => 10,
                'status' => 'libre'
            ]);
        }
    } else {
        echo "Le parking " . $p->name . " a déjà des zones.\n";
    }
}

echo "Remplissage terminé !";
