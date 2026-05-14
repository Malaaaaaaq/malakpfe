<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParkingZone extends Model
{
    protected $fillable = ['parking_id', 'name', 'level'];

    public function parking()
    {
        return $this->belongsTo(Parking::class);
    }

    public function spots()
    {
        return $this->hasMany(ParkingSpot::class, 'zone_id');
    }
}
