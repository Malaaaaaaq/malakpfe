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
        Schema::table('users', function (Blueprint $label) {
            $label->string('parking_name')->nullable()->after('role');
            $label->decimal('latitude', 10, 7)->nullable()->after('parking_name');
            $label->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $label) {
            $label->dropColumn(['parking_name', 'latitude', 'longitude']);
        });
    }
};
