<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\\Contracts\\Console\\Kernel');
$kernel->bootstrap();

$zones = \App\Models\ParkingZone::take(10)->get();
echo "Parking Zones (first 10):\n";
foreach($zones as $z) {
    echo "Zone: " . $z->name . " (ID: " . $z->id . ")\n";
}

$spots = \App\Models\ParkingSpot::take(10)->get();
echo "\nParking Spots (first 10):\n";
foreach($spots as $s) {
    echo "Spot: " . $s->code . " (Status: " . $s->status . ", Zone ID: " . $s->zone_id . ")\n";
}
