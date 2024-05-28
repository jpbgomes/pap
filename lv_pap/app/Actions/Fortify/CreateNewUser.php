<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
        ])->validate();

        $username = $this->generateUniqueUsername($input['name']);

        if (isset($input['runner_type'])) {
            if ($input['runner_type'] === "on") {
                return User::create([
                    'name' => $input['name'],
                    'username' =>  $username,
                    'runner_type' =>  'atleta',
                    'email' => $input['email'],
                    'password' => Hash::make($input['password']),
                ]);
            } else {
                return User::create([
                    'name' => $input['name'],
                    'username' =>  $username,
                    'runner_type' =>  'guia',
                    'email' => $input['email'],
                    'password' => Hash::make($input['password']),
                ]);
            }
        } else {
            return User::create([
                'name' => $input['name'],
                'username' =>  $username,
                'runner_type' =>  'guia',
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
            ]);
        }
    }

    private function generateUniqueUsername($name)
    {
        $cleanName = strtolower(str_replace(' ', '', $name));
        $count = User::where('username', $cleanName)->count();
        $username = $count > 0 ? $cleanName . ($count + 1) : $cleanName;

        return $username;
    }
}
