<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\\Contracts\\Console\\Kernel');
$kernel->bootstrap();

echo 'Parking Zones count: ' . \App\Models\ParkingZone::count() . "\n";
echo 'Parking Spots count: ' . \App\Models\ParkingSpot::count() . "\n";
