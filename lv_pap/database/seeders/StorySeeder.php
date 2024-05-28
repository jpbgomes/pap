<?php

namespace Database\Seeders;

use App\Models\Story;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('stories')->delete();

        $story = Story::create([
            'title' => 'Projeto Sexto Sentido na Pro Runners',
            'subtitle' => 'Integração na Pro Runners',
            'slug' => 'pro_runners_17',
            'image' => 'stories/pro_runners_17.jpg',
            'description' => 'São muitos os artigos que vai poder ler na Pro Runners Magazine #17. Entre eles pode conhecer o Projeto Sexto Sentido, um projeto de inclusão social no desporto que permite que pessoas cegas ou com baixa visão possam realizar corrida e caminhada guiada.',
            'url' => 'https://www.prorunners.pt/noticia/16/1881/projeto-sexto-sentido-na-pro-runners-17',
        ]);

        $story = Story::create([
            'title' => 'Projeto de Corrida para Cegos criado no Brasil',
            'subtitle' => 'Atualmente com mais de 20 duplas no Porto',
            'slug' => 'barbara',
            'image' => 'stories/barbara.png',
            'description' => 'Guia e marido de Bárbara, Ricardo Ribeiro contou que, no Porto, entre atletas e guias já contabilizam “cerca de 20 duplas a correr”, um número que classificou de “muito bom”',
            'url' => 'https://www.prorunners.pt/noticia/16/1881/projeto-sexto-sentido-na-pro-runners-17',
        ]);

        $story = Story::create([
            'title' => 'Pro Runners 17',
            'subtitle' => 'Edição Especial',
            'slug' => 'pro_runners',
            'image' => 'stories/pro_runners.jpg',
            'description' => 'O Projeto Sexto Sentido visa aumentar a inclusão social no desporto.',
            'url' => 'https://www.prorunners.pt/noticia/16/1881/projeto-sexto-sentido-na-pro-runners-17',
        ]);
    }
}
