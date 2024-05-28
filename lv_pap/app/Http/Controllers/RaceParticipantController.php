<?php

namespace App\Http\Controllers;

use App\Models\Race;
use App\Models\RacePair;
use App\Models\RaceParticipant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class RaceParticipantController extends Controller
{
    public function joinRace($race_id)
    {
        $race = Race::findOrFail($race_id);
        $user = Auth::user();

        $existingParticipant = RaceParticipant::where('user_id', $user->id)
            ->where('race_id', $race->id)
            ->exists();

        if ($existingParticipant) {
            session()->flash('flash.banner', 'Já estás inscrito nesta corrida.');
            session()->flash('flash.bannerStyle', 'error');
            return redirect()->back();
        }

        RaceParticipant::create([
            'user_id' => $user->id,
            'race_id' => $race->id,
            'wants_to_change' => false,
        ]);

        session()->flash('flash.banner', 'Inscrição realizada.');
        session()->flash('flash.bannerStyle', 'success');
        return redirect()->back();
    }

    public function leaveRace($race_id)
    {
        $race = Race::findOrFail($race_id);
        $user = Auth::user();

        $existingParticipant = RaceParticipant::where('user_id', $user->id)
            ->where('race_id', $race->id)
            ->first();

        if (!$existingParticipant) {
            session()->flash('flash.banner', 'Não estás inscrito nesta corrida.');
            session()->flash('flash.bannerStyle', 'error');
            return redirect()->back();
        }

        $existingParticipantId = $existingParticipant->id;

        RacePair::where(function ($query) use ($existingParticipantId) {
            $query->where('participant_athlete_id', $existingParticipantId)
                ->orWhere('participant_guide_id', $existingParticipantId);
        })
            ->where('race_participant_id', $race->id)
            ->delete();

        $existingParticipant->delete();

        session()->flash('flash.banner', 'Inscrição cancelada.');
        session()->flash('flash.bannerStyle', 'success');
        return redirect()->back();
    }
}
