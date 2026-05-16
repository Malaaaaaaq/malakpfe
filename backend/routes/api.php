<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\VehicleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — ParLak
|--------------------------------------------------------------------------
*/

Route::get('/parkings', [\App\Http\Controllers\API\ParkingController::class, 'index']);

// ── Newsletter ──────────────────────────────────────────────
Route::post('/newsletter/subscribe', function (\Illuminate\Http\Request $request) {
    $request->validate(['email' => 'required|email']);
    // Normalement, vous enregistreriez l'email dans une table "subscribers" ici
    try {
        \Illuminate\Support\Facades\Mail::to($request->email)->send(new \App\Mail\WelcomeNewsletter("Ami de ParLak"));
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Erreur envoi email newsletter: ' . $e->getMessage());
        return response()->json(['message' => 'Impossible d\'envoyer l\'email pour le moment.'], 500);
    }
    return response()->json(['message' => 'Email envoyé avec succès !']);
});

// ── Auth (public) ──────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ── Routes protégées (Sanctum token) ──────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me',      [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Profil utilisateur
    Route::get('/profile',  [UserController::class, 'show']);
    Route::put('/profile',  [UserController::class, 'update']);

    // Véhicules
    Route::get('/vehicles',        [VehicleController::class, 'index']);
    Route::post('/vehicles',       [VehicleController::class, 'store']);
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);

    // Réservations
    Route::get('/reservations',                  [ReservationController::class, 'index']);
    Route::post('/reservations',                 [ReservationController::class, 'store']);
    Route::patch('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
});
