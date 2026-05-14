<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Parking;

class DemoParkingSeeder extends Seeder
{
    public function run()
    {
        // Casablanca
        $casa = City::firstOrCreate(['name' => 'Casablanca']);
        
        $p1 = Parking::updateOrCreate(
            ['name' => 'Parking Anfa Place'],
            [
                'city_id' => $casa->id,
                'address' => 'Boulevard de la Corniche, Anfa',
                'latitude' => 33.602,
                'longitude' => -7.665,
                'total_spots' => 150,
                'rating' => 4.6,
                'is_active' => true,
            ]
        );

        $p2 = Parking::updateOrCreate(
            ['name' => 'Gare Casa-Voyageurs'],
            [
                'city_id' => $casa->id,
                'address' => 'Boulevard Bahmad, Belvédère',
                'latitude' => 33.589,
                'longitude' => -7.581,
                'total_spots' => 80,
                'rating' => 4.1,
                'is_active' => true,
            ]
        );

        $p3 = Parking::updateOrCreate(
            ['name' => 'Twin Center Parking'],
            [
                'city_id' => $casa->id,
                'address' => 'Boulevard Zerktouni, Maarif',
                'latitude' => 33.585,
                'longitude' => -7.632,
                'total_spots' => 200,
                'rating' => 4.8,
                'is_active' => true,
            ]
        );

        // Rabat
        $rabat = City::firstOrCreate(['name' => 'Rabat']);
        
        $p4 = Parking::updateOrCreate(
            ['name' => 'Gare Rabat Agdal'],
            [
                'city_id' => $rabat->id,
                'address' => 'Avenue Abderrahim Bouabid, Agdal',
                'latitude' => 33.998,
                'longitude' => -6.852,
                'total_spots' => 100,
                'rating' => 4.4,
                'is_active' => true,
            ]
        );

        echo "Demo parkings seeded successfully!\n";
    }
}
