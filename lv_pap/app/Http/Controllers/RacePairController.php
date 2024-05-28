<?php

namespace App\Http\Controllers;

use App\Models\RacePair;
use App\Models\RaceParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RacePairController extends Controller
{
    public function loadMakePage()
    {
        $userId = Auth::user()->id;

        $userRaces = RaceParticipant::where('user_id', $userId)
            ->with('race')
            ->get();

        $pairedRacesIds = RacePair::whereIn('participant_athlete_id', function ($query) use ($userId) {
            $query->select('id')
                ->from('race_participants')
                ->where('user_id', $userId);
        })
            ->orWhereIn('participant_guide_id', function ($query) use ($userId) {
                $query->select('id')
                    ->from('race_participants')
                    ->where('user_id', $userId);
            })
            ->pluck('race_participant_id')
            ->toArray();

        $races = $userRaces->pluck('race')->unique()->reject(function ($race) use ($pairedRacesIds) {
            return in_array($race->id, $pairedRacesIds);
        });

        $participants = [];
        foreach ($races as $race) {
            $participants[$race->title] = RaceParticipant::where('race_id', $race->id)
                ->whereNotIn('id', function ($query) {
                    $query->select('participant_athlete_id')
                        ->from('race_pairs')
                        ->whereColumn('race_pairs.race_participant_id', 'race_participants.race_id');
                })
                ->where('user_id', '!=', $userId)
                ->with('user')
                ->get();
        }

        return view('make-pairs', ['races' => $races, 'participants' => $participants]);
    }

    public function loadPairsPage()
    {
        $pairs = RacePair::with(['athlete', 'guide', 'race'])->get();

        return view('pairs', ['pairs' => $pairs]);
    }

    public function joinPair($race_id, $athlete_id, $guide_id)
    {
        $participant_athlete_id = null;
        $participant_guide_id = null;

        if ($athlete_id === 'my_id') {
            $userParticipant = RaceParticipant::where('user_id', Auth::user()->id)
                ->where('race_id', $race_id)
                ->first();

            $participant_athlete_id = $userParticipant->id;

            if ($guide_id === 'random') {
                $eligibleParticipants = RaceParticipant::where('race_id', $race_id)
                    ->with('user')
                    ->get();

                $finalParticipants = [];

                foreach ($eligibleParticipants as $participant) {
                    if ($participant->user->runner_type === "guia" && $participant->user->id !== Auth::user()->id) {
                        $finalParticipants[] = $participant;
                    }
                }

                $randomParticipant = collect($finalParticipants)->random();
                $participant_guide_id = $randomParticipant->id;
            } else {
                $participant_guide_id = $guide_id;
            }
        } elseif ($guide_id === 'my_id') {
            $userParticipant = RaceParticipant::where('user_id', Auth::user()->id)
                ->where('race_id', $race_id)
                ->first();

            $participant_guide_id = $userParticipant->id;

            if ($athlete_id === 'random') {
                $eligibleParticipants = RaceParticipant::where('race_id', $race_id)
                    ->with('user')
                    ->get();

                $finalParticipants = [];

                foreach ($eligibleParticipants as $participant) {
                    if ($participant->user->runner_type === "atleta" && $participant->user->id !== Auth::user()->id) {
                        $finalParticipants[] = $participant;
                    }
                }

                $randomParticipant = collect($finalParticipants)->random();
                $participant_athlete_id = $randomParticipant->id;
            } else {
                $participant_athlete_id = $athlete_id;
            }
        }

        if ($participant_athlete_id !== null && $participant_guide_id !== null) {
            RacePair::create([
                'participant_athlete_id' => $participant_athlete_id,
                'participant_guide_id' => $participant_guide_id,
                'race_participant_id' => $race_id,
            ]);

            session()->flash('flash.banner', 'Par feito com sucesso.');
            session()->flash('flash.bannerStyle', 'success');
            return redirect()->back();
        } else {
            session()->flash('flash.banner', 'Aconteceu algum erro, tenta novamente.');
            session()->flash('flash.bannerStyle', 'error');
            return redirect()->back();
        }
    }

    public function leavePair($race_id, $athlete_id, $guide_id)
    {
        $pairToDelete = RacePair::where('race_participant_id', $race_id)
            ->where('participant_athlete_id', $athlete_id)
            ->where('participant_guide_id', $guide_id)
            ->first();

        if ($pairToDelete) {
            $pairToDelete->delete();

            session()->flash('flash.banner', 'Pair removido com sucesso.');
            session()->flash('flash.bannerStyle', 'success');
        } else {
            session()->flash('flash.banner', 'Pair não encontrado ou já foi removido.');
            session()->flash('flash.bannerStyle', 'error');
        }

        return redirect()->back();
    }
}
