<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RaceParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('race_participants')->insert([
            'user_id' => '1',
            'race_id' => '1',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('race_participants')->insert([
            'user_id' => '2',
            'race_id' => '1',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('race_participants')->insert([
            'user_id' => '3',
            'race_id' => '1',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('race_participants')->insert([
            'user_id' => '4',
            'race_id' => '1',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('race_participants')->insert([
            'user_id' => '5',
            'race_id' => '1',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('race_participants')->insert([
            'user_id' => '1',
            'race_id' => '2',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('race_participants')->insert([
            'user_id' => '2',
            'race_id' => '2',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('race_participants')->insert([
            'user_id' => '3',
            'race_id' => '2',
            'wants_to_change' => '0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
