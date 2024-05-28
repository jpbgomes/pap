<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Race;
use App\Models\RacePair;
use App\Models\RaceParticipant;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RacePairController extends Controller
{
  public function getPairs(Request $request)
  {
    $user = $request->user();
    $userId = $user->id;

    if (!$user) {
      return response()->json(['success' => false, 'errors' => 'Utilizador não encontrado'], 401);
    }

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
      $participants[$race->name] = RaceParticipant::where('race_id', $race->id)
        ->whereNotIn('id', function ($query) {
          $query->select('participant_athlete_id')
            ->from('race_pairs')
            ->whereColumn('race_pairs.race_participant_id', 'race_participants.race_id');
        })
        ->where('user_id', '!=', $userId)
        ->with('user')
        ->get();
    }

    $pairs = RacePair::with(['athlete', 'guide', 'race'])->get();

    return response()->json(['success' => true, 'races' => $races, 'participants' => $participants, 'pairs' => $pairs], 200);
  }

  public function joinPair(Request $request)
  {
    $user = $request->user();
    $userId = $user->id;

    if (!$user) {
      return response()->json(['success' => false, 'errors' => 'Utilizador não encontrado'], 401);
    }

    $race = Race::findOrFail($request->input('race_id'));
    $race_id = $race->id;

    $participant_athlete_id = null;
    $participant_guide_id = null;

    $athlete_id = ($request->input('athlete_id'));
    $guide_id = ($request->input('guide_id'));

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

      return response()->json(['success' => true, 'errors' => null, 'message' => 'Par feito com sucesso.'], 200);
    } else {
      return response()->json(['success' => false, 'errors' => ['user' => ['Aconteceu algum erro, tenta novamente mais tarde']]], 401);
    }
  }

  public function leavePair(Request $request)
  {
    $user = $request->user();
    $userId = $user->id;

    if (!$user) {
      return response()->json(['success' => false, 'errors' => 'Utilizador não encontrado'], 401);
    }
  }
}
