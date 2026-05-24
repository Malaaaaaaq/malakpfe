<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\VehicleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PromoController;


/*
|--------------------------------------------------------------------------
| API Routes — ParLak
|--------------------------------------------------------------------------
*/

Route::get('/parkings', [\App\Http\Controllers\API\ParkingController::class, 'index']);
Route::get('/parkings/{parking}/zones', [\App\Http\Controllers\API\ParkingController::class, 'zones']);

// ── Newsletter ──────────────────────────────────────────────
Route::post('/newsletter/subscribe', function (\Illuminate\Http\Request $request) {
    $request->validate(['email' => 'required|email|unique:newsletter_subscribers,email']);

    try {
        \App\Models\NewsletterSubscriber::create(['email' => $request->email]);
        \Illuminate\Support\Facades\Mail::to($request->email)->send(new \App\Mail\WelcomeNewsletter("Ami de ParLak"));
    } catch (\Exception $e) {
        if (str_contains($e->getMessage(), 'Duplicate entry')) {
            return response()->json(['message' => 'Cet email est déjà abonné.'], 409);
        }
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
    Route::post('/promo/validate',               [PromoController::class, 'validateCode']);
    Route::post('/promo/apply',                  [PromoController::class, 'apply']);
    Route::get('/promos/active',                  [PromoController::class, 'active']);
    Route::get('/agent/reservations',            [ReservationController::class, 'agentReservations']);
    Route::post('/agent/reservations/{reservation}/confirm', [ReservationController::class, 'confirm']);
    Route::post('/agent/reservations/{reservation}/refuse',  [ReservationController::class, 'refuse']);
    Route::get('/agent/spots',                   [\App\Http\Controllers\API\ParkingController::class, 'agentSpots']);
    Route::patch('/agent/spots/{spot}',          [\App\Http\Controllers\API\ParkingController::class, 'updateSpot']);
    Route::get('/agent/parking',                 [\App\Http\Controllers\API\ParkingController::class, 'getAgentParking']);
    Route::put('/agent/parking',                 [\App\Http\Controllers\API\ParkingController::class, 'updateParking']);
    Route::patch('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);

    // ── Espace Administrateur (Malak & Fatima) ─────────────────
    Route::prefix('admin')->middleware(['admin'])->group(function () {
        // Promos
        Route::get('/promos', [PromoController::class, 'index']);
        Route::post('/promos', [PromoController::class, 'store']);
        Route::put('/promos/{promo}', [PromoController::class, 'update']);
        Route::patch('/promos/{promo}/active', [PromoController::class, 'toggleActive']);
        Route::post('/promos/{promo}/send', [PromoController::class, 'sendToSubscribers']);
        Route::delete('/promos/{promo}', [PromoController::class, 'destroy']);

        Route::get('/dashboard-stats', [\App\Http\Controllers\API\AdminController::class, 'dashboardStats']);

        Route::get('/cities', [\App\Http\Controllers\API\AdminController::class, 'getCities']);
        Route::get('/parkings', [\App\Http\Controllers\API\AdminController::class, 'parkings']);
        Route::post('/parkings', [\App\Http\Controllers\API\AdminController::class, 'storeParking']);
        Route::put('/parkings/{parking}', [\App\Http\Controllers\API\AdminController::class, 'updateParking']);
        Route::delete('/parkings/{parking}', [\App\Http\Controllers\API\AdminController::class, 'destroyParking']);
        Route::get('/agents', [\App\Http\Controllers\API\AdminController::class, 'agents']);
        Route::post('/agents', [\App\Http\Controllers\API\AdminController::class, 'storeAgent']);
        Route::put('/agents/{user}', [\App\Http\Controllers\API\AdminController::class, 'updateAgent']);
        Route::delete('/agents/{user}', [\App\Http\Controllers\API\AdminController::class, 'destroyAgent']);
        Route::get('/reservations/export', [\App\Http\Controllers\API\AdminController::class, 'exportReservations']);
        Route::get('/reservations', [\App\Http\Controllers\API\AdminController::class, 'reservations']);
        Route::patch('/reservations/{reservation}/status', [\App\Http\Controllers\API\AdminController::class, 'updateReservationStatus']);
    });
});
