<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- ALTERATION DE LA TABLE RESERVATIONS ---\n";
try {
    Illuminate\Support\Facades\DB::statement("ALTER TABLE reservations MODIFY COLUMN status VARCHAR(50) DEFAULT 'upcoming'");
    echo "✅ Colonne 'status' de la table 'reservations' modifiée avec succès en VARCHAR(50) !\n";
} catch (\Exception $e) {
    echo "❌ Erreur lors de la modification de la table: " . $e->getMessage() . "\n";
}

echo "--- DEBUT DU NETTOYAGE DES DUPLICATAS ---\n";

// 1. Trouver les parkings orphelins (user_id est NULL)
$orphanParkings = App\Models\Parking::whereNull('user_id')->get();
echo "Parkings orphelins trouvés: " . $orphanParkings->count() . "\n";

foreach ($orphanParkings as $p) {
    echo "Suppression du parking orphelin #{$p->id} ({$p->name})...\n";
    foreach ($p->zones as $z) {
        $z->spots()->delete();
    }
    $p->zones()->delete();
    $p->delete();
}

// 2. Nettoyer les réservations orphelines
$reservationsOrphelines = App\Models\Reservation::whereNull('spot_id')
    ->orWhereDoesntHave('spot')
    ->get();
echo "Réservations orphelines trouvées: " . $reservationsOrphelines->count() . "\n";
foreach ($reservationsOrphelines as $r) {
    $r->delete();
}

echo "--- FIN DE LA PROCEDURE ---\n";
