$u = App\Models\User::where('email', 'test@gmail.com')->first();
$ids = App\Models\Parking::where('user_id', $u->id)->pluck('id');
echo "Count total_spots: " . App\Models\ParkingSpot::whereHas('zone', function($q) use ($ids){
    $q->whereIn('parking_id', $ids);
})->count() . "\n";
echo "Count free_spots: " . App\Models\ParkingSpot::whereHas('zone', function($q) use ($ids){
    $q->whereIn('parking_id', $ids);
})->where('status', 'libre')->count() . "\n";
