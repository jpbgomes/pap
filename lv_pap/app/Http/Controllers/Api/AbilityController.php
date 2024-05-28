<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ability;
use Illuminate\Http\Request;

class AbilityController extends Controller
{
    public function getAbilities(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => 'Utilizador não encontrado'], 404);
        }

        $userWithAbilities = $user->with('abilities')->find($user->id);
        return response()->json(['success' => true, 'abilities' => $userWithAbilities->abilities], 200);
    }
}
