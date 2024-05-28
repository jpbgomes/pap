<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Race;
use App\Models\RaceParticipant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class RaceController extends Controller
{
    public function getRaces()
    {
        $races = Race::orderByDesc('created_at')->with('participants')->get();

        $participations = [];

        if (Auth::check()) {
            $participations = RaceParticipant::where('user_id', Auth::user()->id)
                ->get();
        }

        return view('races.races', [
            'heading' => 'Races Page',
            'races' => $races,
            'participations' => $participations
        ]);
    }
}
