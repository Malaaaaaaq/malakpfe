<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParkingSpot extends Model
{
    protected $fillable = ['zone_id', 'code', 'type', 'price_per_hour', 'status'];

    public function zone()
    {
        return $this->belongsTo(ParkingZone::class, 'zone_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'spot_id');
    }
}
