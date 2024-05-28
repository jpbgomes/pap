<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $raceId = DB::table('races')->insertGetId([
            'name' => 'race_1',
            'edition' => '2024',
            'title' => 'Corrida Da República',
            'description' => 'Na manhã ensolarada do Dia da República, a cidade se transforma em um mar de cores patrióticas com a "Corrida Republicana".

Os participantes, vestidos com as cores da bandeira nacional, correm em sintonia, manifestando seu orgulho e compromisso com os valores fundamentais da nação. 

O percurso não é apenas uma corrida, mas uma expressão coletiva de liberdade, igualdade e fraternidade, encapsulando o espírito do país.',
            'image_path' => 'https://i.imgur.com/0l5iiR7.png',
            'district' => 'porto',
            'minimum_condition' => 'beginner',
            'start_time' => '09:00',
            'end_time' => '18:00',
            'date' => '2024-08-08',
            'has_accessibility' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        $raceId2 = DB::table('races')->insertGetId([
            'name' => 'race_2',
            'edition' => '2024',
            'title' => 'Corrida dos Imigrantes',
            'description' => 'Nas ruas movimentadas da cidade, a "Corrida da Diversidade" é mais do que uma competição atlética, é uma celebração vibrante da riqueza cultural dos imigrantes.
            
Corredores de todas as origens se alinham, seus passos ecoando histórias de perseverança e sucesso. 

As cores das bandeiras de diferentes nações tremulam no ar, enquanto o pulsar da diversidade cria uma atmosfera única de união e respeito.',
            'image_path' => 'https://i.imgur.com/HMuDVJW.jpg',
            'district' => 'faro',
            'minimum_condition' => 'advanced',
            'start_time' => '16:00',
            'end_time' => '18:00',
            'date' => '2024-10-05',
            'has_accessibility' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
