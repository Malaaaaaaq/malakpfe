<?php

// Bootstrapping Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admins = [
    [
        'firstname' => 'Malak',
        'lastname' => 'Tamrani',
        'email' => 'malak.tamrani@parlak.ma',
        'password' => 'Malak@2026',
    ],
    [
        'firstname' => 'Fatima Zahra',
        'lastname' => 'Hofr',
        'email' => 'fatimazahra.hofr@parlak.ma',
        'password' => 'Fatima@2026',
    ]
];

foreach ($admins as $ad) {
    $user = User::where('email', $ad['email'])->first();
    if ($user) {
        $user->firstname = $ad['firstname'];
        $user->lastname = $ad['lastname'];
        $user->password = Hash::make($ad['password']); // Hachage sécurisé Bcrypt avant enregistrement
        $user->role = 'admin';
        $user->save();
        echo "✅ Mot de passe unique configuré avec succès pour : {$ad['firstname']} {$ad['lastname']} ({$ad['email']})\n";
    } else {
        User::create([
            'firstname' => $ad['firstname'],
            'lastname' => $ad['lastname'],
            'email' => $ad['email'],
            'phone' => '0600000000',
            'role' => 'admin',
            'password' => Hash::make($ad['password']),
        ]);
        echo "✅ Compte créé avec mot de passe unique pour : {$ad['firstname']} {$ad['lastname']} ({$ad['email']})\n";
    }
}

echo "\n------------------------------------------------------\n";
echo "🔒 Les mots de passe ont été hachés et sécurisés en base de données.\n";
echo "------------------------------------------------------\n";
