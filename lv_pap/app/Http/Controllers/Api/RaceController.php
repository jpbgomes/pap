<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Race;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RaceController extends Controller
{
    public function getRaces(Request $request)
    {
        $races = Race::orderByDesc('created_at')->get();

        if ($races->isNotEmpty()) {
            return response()->json(['errors' => null, 'message' => 'Corridas Returnadas', 'races' => $races], 200);
        } else {
            return response()->json(['errors' => true, 'message' => 'Não há corridas', 'races' => []], 401);
        }
    }

    public function createRace(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => [['user' => 'Utilizador não encontrado']]], 404);
        }

        $fValidator = Validator::make($request->all(), [
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
            'hora_partida' => 'required|date_format:H:i:s',
            'hora_chegada' => 'required|date_format:H:i:s|after:hora_partida',
            'condicao_minima' => 'required|in:beginner,experienced,advanced',
            'tem_acessibilidade' => 'required|in:true,false',
        ]);

        if ($fValidator->fails()) {
            return response()->json(['success' => false, 'errors' => $fValidator->errors()->toArray()], 400);
        }

        $raceUniqueName = uniqid('race_');

        if ($request->file('image') !==  null) {
            $image = $request->file('image');
            $filename = 'race_image_' . $raceUniqueName . "." . $image->getClientOriginalExtension();
            $storagePath = 'race_photos/';

            if (!file_exists(public_path($storagePath))) {
                mkdir(public_path($storagePath), 0755, true);
            }

            $image->move(public_path($storagePath), $filename);
            $finalPath = $storagePath . $filename;

            $race = new Race([
                'name' => $raceUniqueName,
                'edition' => $request->input('edicao'),
                'image_path' => $finalPath,
                'district' => $request->input('distrito'),
                'title' => $request->input('titulo'),
                'description' => $request->input('descricao'),
                'minimum_condition' => $request->input('condicao_minima'),
                'start_time' => $request->input('hora_partida'),
                'end_time' => $request->input('hora_chegada'),
                'date' => $request->input('data'),
                'has_accessibility' => $request->input('tem_acessibilidade') === 'true',
            ]);

            $race->save();
            return response()->json(['success' => true, 'errors' => null, 'message' => 'Corrida criada com sucesso'], 200);
        } else {
            $race = new Race([
                'name' => $raceUniqueName,
                'edition' => $request->input('edicao'),
                'district' => $request->input('distrito'),
                'title' => $request->input('titulo'),
                'description' => $request->input('descricao'),
                'minimum_condition' => $request->input('condicao_minima'),
                'start_time' => $request->input('hora_partida'),
                'end_time' => $request->input('hora_chegada'),
                'date' => $request->input('data'),
                'has_accessibility' => $request->input('tem_acessibilidade') === 'true',
            ]);

            $race->save();
            return response()->json(['success' => true, 'errors' => null, 'message' => 'Corrida criada com sucesso'], 200);
        }
    }
}
