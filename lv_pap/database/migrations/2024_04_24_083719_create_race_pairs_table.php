<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('race_pairs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('participant_athlete_id');
            $table->unsignedBigInteger('participant_guide_id');
            $table->unsignedBigInteger('race_participant_id');
            $table->foreign('participant_athlete_id')->references('id')->on('race_participants')->onDelete('cascade');
            $table->foreign('participant_guide_id')->references('id')->on('race_participants')->onDelete('cascade');
            $table->foreign('race_participant_id')->references('id')->on('races')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['participant_athlete_id', 'race_participant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('race_pairs');
    }
};
