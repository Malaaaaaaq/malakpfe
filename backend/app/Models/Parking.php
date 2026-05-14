<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parking extends Model
{
    protected $fillable = [
        'city_id', 'name', 'address', 'latitude', 'longitude',
        'total_spots', 'rating', 'is_active',
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function zones()
    {
        return $this->hasMany(ParkingZone::class);
    }

    public function spots()
    {
        return $this->hasManyThrough(ParkingSpot::class, ParkingZone::class, 'parking_id', 'zone_id');
    }

    public function freeSpots()
    {
        return $this->spots()->where('status', 'libre');
    }
}
