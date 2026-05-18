<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Parking;
use Illuminate\Support\Facades\Hash;

class ProAgentsSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Supprimer les comptes non professionnels ───────────────
        foreach (['test@gmail.com', 'hhhhhhh@gmail.com'] as $email) {
            $u = User::where('email', $email)->first();
            if ($u) {
                foreach (Parking::where('user_id', $u->id)->get() as $p) {
                    foreach ($p->zones as $z) {
                        $z->spots()->delete();
                    }
                    $p->zones()->delete();
                    $p->delete();
                }
                $u->delete();
                $this->command->info("✅ Supprimé: $email");
            }
        }

        // ─── 2. Créer les agents professionnels ───────────────────────
        $agents = [
            [
                'first' => 'Karima', 'last' => 'Idrissi',
                'email' => 'karima.idrissi@parlak.ma', 'phone' => '0612345678',
                'park' => 'Twin Center Parking', 'city_id' => 1,
                'lat' => 33.5867, 'lng' => -7.6430, 'addr' => 'Bd Zerktouni, Maarif, Casablanca',
            ],
            [
                'first' => 'Hassan', 'last' => 'Moukrim',
                'email' => 'hassan.moukrim@parlak.ma', 'phone' => '0623456789',
                'park' => 'Parking Agdal Center', 'city_id' => 2,
                'lat' => 33.9857, 'lng' => -6.8509, 'addr' => 'Av. Al Amir Fal Ould Omeir, Rabat',
            ],
            [
                'first' => 'Sofia', 'last' => 'Alaoui',
                'email' => 'sofia.alaoui@parlak.ma', 'phone' => '0634567890',
                'park' => 'Parking Gueliz Premium', 'city_id' => 3,
                'lat' => 31.6358, 'lng' => -8.0099, 'addr' => 'Av. Mohammed V, Gueliz, Marrakech',
            ],
            [
                'first' => 'Omar', 'last' => 'Tahiri',
                'email' => 'omar.tahiri@parlak.ma', 'phone' => '0645678901',
                'park' => 'Parking Port Tanger Marina', 'city_id' => 4,
                'lat' => 35.7888, 'lng' => -5.8138, 'addr' => 'Av. de la Resistance, Tanger',
            ],
            [
                'first' => 'Nadia', 'last' => 'Berrada',
                'email' => 'nadia.berrada@parlak.ma', 'phone' => '0656789012',
                'park' => 'Parking Medina Fes', 'city_id' => 5,
                'lat' => 34.0647, 'lng' => -4.9783, 'addr' => 'Bab Bou Jeloud, Fes',
            ],
        ];

        foreach ($agents as $a) {
            if (User::where('email', $a['email'])->exists()) {
                $this->command->info("Agent {$a['email']} existe déjà.");
                continue;
            }

            $user = User::create([
                'firstname'    => $a['first'],
                'lastname'     => $a['last'],
                'email'        => $a['email'],
                'phone'        => $a['phone'],
                'role'         => 'agent',
                'parking_name' => $a['park'],
                'password'     => Hash::make('Parlak@2025'),
            ]);

            $parking = Parking::create([
                'user_id'     => $user->id,
                'city_id'     => $a['city_id'],
                'name'        => $a['park'],
                'address'     => $a['addr'],
                'latitude'    => $a['lat'],
                'longitude'   => $a['lng'],
                'total_spots' => 48,
                'rating'      => round(4.2 + (rand(0, 8) / 10), 1),
                'is_active'   => true,
            ]);

            // 4 zones × 12 places = 48 places
            foreach ([
                ['Zone A', 1, ['standard','standard','standard','electrique']],
                ['Zone B', 1, ['standard','standard','vip','standard']],
                ['Zone C', 2, ['standard','standard','standard','standard']],
                ['Zone D', 2, ['handicap','standard','standard','moto']],
            ] as [$zoneName, $level, $types]) {
                $zone = $parking->zones()->create(['name' => $zoneName, 'level' => $level]);
                for ($i = 1; $i <= 12; $i++) {
                    $type  = $types[($i - 1) % count($types)];
                    $price = match ($type) {
                        'vip'       => 20,
                        'electrique'=> 15,
                        'moto'      => 6,
                        'handicap'  => 8,
                        default     => 10,
                    };
                    $zone->spots()->create([
                        'code'           => substr($zoneName, -1) . '-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                        'type'           => $type,
                        'price_per_hour' => $price,
                        'status'         => 'libre',
                    ]);
                }
            }

            $this->command->info("✅ Agent: {$a['first']} {$a['last']} → {$a['park']} (48 places)");
        }

        $this->command->newLine();
        $this->command->info('═══ ÉTAT FINAL ═══');
        foreach (User::where('role', 'agent')->get() as $ag) {
            $total = 0;
            foreach (Parking::where('user_id', $ag->id)->get() as $p) {
                $total += $p->spots()->count();
                $this->command->line("  ✅ {$ag->firstname} {$ag->lastname} → {$p->name} ({$total} places)");
            }
        }
    }
}
