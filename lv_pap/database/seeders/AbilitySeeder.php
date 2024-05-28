<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AbilitySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('abilities')->insert([
            'name' => 'race_creation',
            'slug' => 'Ability To Create a Race',
        ]); 

        DB::table('ability_user')->insert([
            'ability_id' => '1',
            'user_id' => '1',
        ]); 
    }
}