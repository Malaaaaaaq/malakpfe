$p = App\Models\Parking::where('name', 'test')->first();
if ($p) {
    $p->update(['total_spots' => 40]);
    $zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
    foreach ($zones as $idx => $zName) {
        $z = $p->zones()->create(['name' => $zName, 'level' => $idx < 2 ? 1 : 2]);
        for ($i = 1; $i <= 10; $i++) {
            $z->spots()->create([
                'code' => substr($zName, -1) . '-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'type' => 'standard',
                'price_per_hour' => 10,
                'status' => 'libre'
            ]);
        }
    }
    echo "Places ajoutées pour le parking test !";
}
