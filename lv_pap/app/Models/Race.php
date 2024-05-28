<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Race extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'edition',
        'title',
        'description',
        'image_path',
        'district',
        'minimum_condition',
        'start_time',
        'end_time',
        'date',
        'has_accessibility',
    ];

    public function participants()
    {
        return $this->belongsToMany(User::class, 'race_participants')->withTimestamps();
    }
}
