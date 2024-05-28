<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use App\Models\Ability;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
  /**
   * The model to policy mappings for the application.
   *
   * @var array<class-string, class-string>
   */
  protected $policies = [
    //
  ];

  /**
   * Register any authentication / authorization services.
   */
  public function boot(): void
  {
    Gate::define('create_races', function (User $user) {
      $abilityName = 'race_creation';

      $ability = Ability::where('name', $abilityName)->first();

      if (!$user->abilities->contains($ability)) {
        abort(404, 'PAGE NOT FOUND');
      }

      return true;
    });
  }
}
