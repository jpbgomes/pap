<?php

namespace App\Livewire;

use App\Models\Race;
use Illuminate\Validation\Rule;
use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;

class RaceCreation extends Component
{
    use WithFileUploads;

    public $titulo;
    public $descricao;
    public $distrito;
    public $foto; // Updated property to accept file uploads
    public $data;
    public $hora_partida;
    public $hora_chegada;
    public $condicao_minima;
    public $tem_acessibilidade;

    public function render()
    {
        return view('livewire.race-creation');
    }

    public function save()
    {
        $this->validate([
            'titulo' => 'required|string|min:10',
            'descricao' => 'required|string|min:25',
            'distrito' => [
                'required',
                Rule::in([
                    'aveiro', 'beja', 'braga', 'bragança', 'castelo_branco', 'coimbra',
                    'evora', 'faro', 'guarda', 'leiria', 'lisboa', 'portalegre', 'porto',
                    'santarem', 'setubal', 'viana_do_castelo', 'vila_real', 'viseu'
                ]),
            ],
            'data' => 'required|date_format:Y-m-d',
            'hora_partida' => 'required|date_format:H:i',
            'hora_chegada' => 'required|date_format:H:i|after:hora_partida',
            'condicao_minima' => 'required|in:beginner,experienced,advanced',
            'tem_acessibilidade' => 'required|in:true,false',
        ]);

        $race = new Race();

        $currentYear = date('Y');
        $race->edition = $currentYear;

        $raceUniqueName = uniqid('race_');
        $race->name = $raceUniqueName;
        $race->title = $this->titulo;
        $race->description = $this->descricao;
        $race->district = $this->distrito;
        $race->date = $this->data;
        $race->start_time = $this->hora_partida;
        $race->end_time = $this->hora_chegada;
        $race->minimum_condition = $this->condicao_minima;

        $race->has_accessibility = $this->tem_acessibilidade ? 1 : 0;

        if ($this->foto) {
            $this->validate([
                'foto' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $filename = $raceUniqueName . "." . $this->foto->getClientOriginalExtension();
            $storagePath = 'race_photos';

            $this->foto->storeAs($storagePath, $filename, 'race_photos');

            $finalPath = 'race_photos/' . $filename;
            $race->image_path = $finalPath;
        }

        $race->save();

        session()->flash('flash.banner', 'Corrida craida com sucesso.');
        session()->flash('flash.bannerStyle', 'success');
        return redirect('/races');
    }
}
