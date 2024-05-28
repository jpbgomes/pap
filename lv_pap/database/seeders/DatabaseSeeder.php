<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Race;
use App\Models\RaceParticipant;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            RaceSeeder::class,
        ]);

        \App\Models\User::factory(10)->create();

        $this->call([
            AbilitySeeder::class,
            StorySeeder::class,
            RaceParticipantSeeder::class,
        ]);
    }
}
