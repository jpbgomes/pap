<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('races', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('edition');
            $table->string('title');
            $table->longText('description');
            $table->string('image_path')->default("https://i.imgur.com/0l5iiR7.png");
            $table->enum('district', [
                'aveiro', 'beja', 'braga', 'bragança', 'castelo_branco', 'coimbra',
                'evora', 'faro', 'guarda', 'leiria', 'lisboa', 'portalegre', 'porto',
                'santarem', 'setubal', 'viana_do_castelo', 'vila_real', 'viseu'
            ]);
            $table->enum('minimum_condition', ['beginner', 'experienced', 'advanced'])->default('beginner');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->date('date');
            $table->boolean('has_accessibility');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('races');
    }
};
