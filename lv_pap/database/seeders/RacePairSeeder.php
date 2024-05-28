<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RacePairSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('race_pairs')->insert([
            'participant_athlete_id' => '2',
            'participant_guide_id' => '1',
            'race_participant_id' => '1',
        ]);
    }
}
