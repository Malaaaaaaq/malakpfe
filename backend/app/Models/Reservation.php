<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'reference', 'user_id', 'vehicle_id', 'spot_id',
        'spot_code', 'parking_name', 'city_name',
        'entry_date', 'entry_time', 'exit_time',
        'duration_hours', 'total_price', 'status', 'qr_token',
        'promo_code_id', 'discount_amount', 'final_price', 'payment_method',
    ];

    protected function casts(): array
    {
        return [
            'entry_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function spot()
    {
        return $this->belongsTo(ParkingSpot::class, 'spot_id');
    }
}
