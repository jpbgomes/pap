<?php

return [
    App\Providers\AppServiceProvider::class,
    // Não Remover dos Comentários - 404 All Over - Migrate to Laravel 11 Solution
    // App\Providers\AuthServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Providers\JetstreamServiceProvider::class,
    Illuminate\Broadcasting\BroadcastServiceProvider::class,
];
