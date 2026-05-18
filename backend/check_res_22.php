$r = App\Models\Reservation::find(22);
if ($r) {
    echo "Reservation Info:\n";
    print_r($r->toArray());
    if ($r->spot) {
        echo "\nSpot Info:\n";
        print_r($r->spot->toArray());
        if ($r->spot->zone) {
            echo "\nZone Info:\n";
            print_r($r->spot->zone->toArray());
            if ($r->spot->zone->parking) {
                echo "\nParking Info:\n";
                print_r($r->spot->zone->parking->toArray());
            } else {
                echo "\nAucun Parking lié à cette zone.\n";
            }
        } else {
            echo "\nAucune Zone liée à ce spot.\n";
        }
    } else {
        echo "\nAucun Spot lié à cette réservation.\n";
    }
} else {
    echo "Réservation 22 introuvable.";
}
