<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Story;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    public function getStories() {
        $stories = Story::get();   
    
        if ($stories->isNotEmpty()) {
            return response()->json(['errors' => null, 'message' => 'Stories Retrieved', 'stories' => $stories], 200);
        } else {
            return response()->json(['errors' => true, 'message' => 'There are no stories', 'stories' => []], 200);
        }
    }
}
