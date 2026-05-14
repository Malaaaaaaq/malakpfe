<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parking_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parking_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // ex: "Zone A – Niveau 1"
            $table->unsignedTinyInteger('level')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parking_zones');
    }
};
