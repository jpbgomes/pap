<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ChatMessage;
use App\Models\RacePair;
use App\Models\RaceParticipant;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getPairsFromId($id)
    {
        $user = Auth::user();

        $racePairs = RacePair::with(['athlete.user', 'guide.user'])->get();

        $userArray = [];

        foreach ($racePairs as $pair) {
            $athlete = $pair->athlete->user;
            $guide = $pair->guide->user;

            $tarId = null;


            if ($athlete->id === $user->id) {
                $tarId = $guide->id;
            } elseif ($guide->id === $user->id) {
                $tarId = $athlete->id;
            }

            if ($tarId !== null && !in_array($tarId, array_column($userArray, 'tarId'))) {
                $userArray[] = ['tarId' => $tarId];
            }
        }

        $openChats = [];
        foreach ($userArray as $userData) {
            $user = User::find($userData['tarId']);
            if ($user) {
                $openChats[] = $user;
            }
        }

        return $openChats;
    }

    public function loadChatPage($id)
    {
        $openChats = $this->getPairsFromId(1);

        return view('chat', [
            'open_chats' => $openChats,
            'id' => $id,
        ]);
    }
}
