$agents = App\Models\User::where('role', 'agent')->get();
foreach ($agents as $agent) {
    $parkings = App\Models\Parking::where('user_id', $agent->id)->get();
    echo "Agent: " . $agent->email . "\n";
    if ($parkings->isEmpty()) {
        echo "  -> ❌ Aucun parking associé\n";
    } else {
        foreach ($parkings as $p) {
            $spots = $p->spots()->count();
            echo "  -> ✅ Parking: " . $p->name . " (" . $spots . " places)\n";
        }
    }
    echo "\n";
}
