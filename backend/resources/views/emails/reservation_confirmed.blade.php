<x-mail::message>
# Réservation Confirmée ! 🚗

Bonjour {{ $reservation->user->name }},

Votre réservation pour le parking **{{ $reservation->parking_name }}** à **{{ $reservation->city_name }}** a été confirmée avec succès.

### Détails de la réservation :
- **Référence :** {{ $reservation->reference }}
- **Véhicule :** {{ $reservation->vehicle->plate }} ({{ $reservation->vehicle->make }} {{ $reservation->vehicle->model }})
- **Date d'entrée :** {{ $reservation->entry_date->format('d/m/Y') }} à {{ $reservation->entry_time }}
- **Date de sortie :** {{ $reservation->exit_time }}
- **Place :** {{ $reservation->spot_code }}
- **Prix Total :** {{ number_format($reservation->total_price, 2) }} DH

Vous pouvez retrouver votre QR Code d'accès directement dans l'application ParLak dans la section "Mes Réservations".

<x-mail::button :url="config('app.url') . '/reservations'">
Voir mes réservations
</x-mail::button>

**Restez actif pour toute offre à venir !**

Merci d'avoir choisi ParLak pour votre stationnement. Pour toute assistance, contactez-nous au **+212 7-10374815**.

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
