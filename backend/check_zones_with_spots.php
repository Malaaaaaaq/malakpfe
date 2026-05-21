<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\\Contracts\\Console\\Kernel');
$kernel->bootstrap();

$zones = \App\Models\ParkingZone::withCount('spots')->get();
echo "Parking Zones with Spot Counts:\n";
foreach($zones as $z) {
    echo "Zone: " . $z->name . " (" . $z->spots_count . " places)\n";
}
