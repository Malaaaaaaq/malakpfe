<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->unsignedBigInteger('spot_id')->nullable()->change();
            $table->string('spot_code', 20)->nullable()->after('spot_id');
            $table->string('parking_name')->nullable()->after('spot_code');
            $table->string('city_name')->nullable()->after('parking_name');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['spot_code', 'parking_name', 'city_name']);
        });
    }
};
