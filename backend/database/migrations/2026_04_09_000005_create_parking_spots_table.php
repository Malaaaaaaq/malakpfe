<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parking_spots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('parking_zones')->cascadeOnDelete();
            $table->string('code', 10); // ex: A-01
            $table->enum('type', ['standard', 'vip', 'electrique', 'handicap', 'moto'])->default('standard');
            $table->decimal('price_per_hour', 8, 2)->default(8.00);
            $table->enum('status', ['libre', 'occupee', 'reservee'])->default('libre');
            $table->timestamps();

            $table->unique(['zone_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parking_spots');
    }
};
