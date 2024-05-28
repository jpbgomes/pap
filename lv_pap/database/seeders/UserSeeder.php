<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hashedPassword = Hash::make('123123123');

        DB::table('users')->insert([
            'name' => 'José Gomes',
            'username' => 'lascabim',
            'runner_type' => 'guia',
            'profile_photo_path' => 'https://i.imgur.com/jOcbP68.png',
            'email' => 'josepedrogomes27@gmail.com',
            'password' => $hashedPassword,
            'created_at' => now(),
            'email_verified_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'David Freitas',
            'username' => 'david',
            'runner_type' => 'atleta',
            'profile_photo_path' => 'https://www.ambulanceforhearts.pt/img/people/david_freitas.jpg',
            'email' => 'david@gmail.com',
            'password' => $hashedPassword,
            'created_at' => now(),
            'email_verified_at' => now(),
        ]);
    }
}
