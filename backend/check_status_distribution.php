<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\\Contracts\\Console\\Kernel');
$kernel->bootstrap();

$statuses = \App\Models\ParkingSpot::select('status', \DB::raw('count(*) as count'))->groupBy('status')->get();
echo "Parking Spot Status Distribution:\n";
foreach($statuses as $s) {
    echo "Status: " . $s->status . " (" . $s->count . " places)\n";
}
