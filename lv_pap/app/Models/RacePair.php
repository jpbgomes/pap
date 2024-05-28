<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RacePair extends Model
{
    use HasFactory;

    protected $fillable = [
        'race_participant_id',
        'participant_athlete_id',
        'participant_guide_id',
    ];

    public function athlete()
    {
        return $this->belongsTo(RaceParticipant::class, 'participant_athlete_id')->with('user');
    }

    public function guide()
    {
        return $this->belongsTo(RaceParticipant::class, 'participant_guide_id')->with('user');
    }

    public function race()
    {
        return $this->belongsTo(Race::class, 'race_participant_id', 'id');
    }
}
