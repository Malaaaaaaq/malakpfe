<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ResetAdminPasswordSeeder extends Seeder
{
    public function run(): void
    {
        // IMPORTANT: change these passwords to what you want
        $passwords = [
            'malak.tamrani@parlak.ma' => 'Malak@2026',
            'fatimazahra.hofr@parlak.ma' => 'Fatima@2026',
        ];

        foreach ($passwords as $email => $newPassword) {
            $user = User::where('email', $email)->first();
            if (!$user) {
                $this->command->warn("User not found for email: {$email}");
                continue;
            }

            $user->password = Hash::make($newPassword);
            $user->save();

            $this->command->info("Password reset OK for {$email}");
        }
    }
}

