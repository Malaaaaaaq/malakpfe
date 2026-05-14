<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique(); // PRK-2026-XXX
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('spot_id')->constrained('parking_spots')->cascadeOnDelete();
            $table->date('entry_date');
            $table->time('entry_time');
            $table->time('exit_time');
            $table->unsignedTinyInteger('duration_hours');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['upcoming', 'completed', 'cancelled'])->default('upcoming');
            $table->string('qr_token')->unique()->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
