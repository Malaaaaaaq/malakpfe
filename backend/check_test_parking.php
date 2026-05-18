$user = App\Models\User::where('email', 'test@gmail.com')->first();
if ($user) {
    $parkings = App\Models\Parking::where('user_id', $user->id)->get();
    foreach ($parkings as $p) {
        $count = $p->spots()->count();
        echo "Parking: " . $p->name . " a " . $count . " places.\n";
        
        // Si le parking n'a pas de places, on lui en donne !
        if ($count == 0) {
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
            echo "-> 40 places ont été créées pour " . $p->name . " !\n";
        }
    }
} else {
    echo "L'utilisateur test@gmail.com n'a pas été trouvé.\n";
}
