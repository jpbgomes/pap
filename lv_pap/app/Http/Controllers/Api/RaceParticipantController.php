<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Race;
use App\Models\RacePair;
use App\Models\RaceParticipant;
use App\Models\Story;
use Illuminate\Http\Request;

class RaceParticipantController extends Controller
{
  public function joinRace(Request $request)
  {
    $user = $request->user();

    if (!$user) {
      return response()->json(['success' => false, 'errors' => ['user' => ['Utilizador não encontrado, faz login novamente']]], 401);
    }

    $race = Race::findOrFail($request->input('race_id'));

    $existingParticipant = RaceParticipant::where('user_id', $user->id)
      ->where('race_id', $race->id)
      ->exists();

    if ($existingParticipant) {
      return response()->json(['success' => false, 'errors' => ['user' => ['Já estás inscrito nesta corrida']]], 401);
    }

    RaceParticipant::create([
      'user_id' => $user->id,
      'race_id' => $race->id,
      'wants_to_change' => false,
    ]);

    return response()->json(['success' => true, 'errors' => null, 'message' => 'Inscrição realizada.'], 200);
  }

  public function leaveRace(Request $request)
  {
    $user = $request->user();

    if (!$user) {
      return response()->json(['success' => false, 'errors' => ['user' => ['Utilizador não encontrado, faz login novamente']]], 401);
    }

    $race = Race::findOrFail($request->input('race_id'));

    $existingParticipant = RaceParticipant::where('user_id', $user->id)
      ->where('race_id', $race->id)
      ->first();

    if (!$existingParticipant) {
      return response()->json(['success' => false, 'errors' => ['user' => ['Não estás inscrito nesta corrida']]], 401);
    }

    $existingParticipantId = $existingParticipant->id;

    RacePair::where(function ($query) use ($existingParticipantId) {
      $query->where('participant_athlete_id', $existingParticipantId)
        ->orWhere('participant_guide_id', $existingParticipantId);
    })
      ->where('race_participant_id', $race->id)
      ->delete();

    $existingParticipant->delete();

    return response()->json(['success' => true, 'errors' => null, 'message' => 'Inscrição cancelada.'], 200);
  }
}
