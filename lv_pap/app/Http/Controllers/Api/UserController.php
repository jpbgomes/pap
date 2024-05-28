<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\Rule;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function checkToken(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => 'Utilizador não encontrado'], 401);
        } else {
            return response()->json(['success' => true, 'errors' => 'Utilizador encontrado'], 200);
        }
    }

    public function createUser(Request $request)
    {
        $name = $request->input('nome');
        $email = strtolower($request->input('email'));

        $password = $request->input('password');
        $confirmPassword = $request->input('confirmacao_password');

        $validator = Validator::make($request->all(), [
            'nome' => ['required', 'string', 'min:8', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'confirmacao_password' => ['required', 'same:password'],
            'tipo_de_corredor' => [
                'required', Rule::in(['atleta', 'guia']),
            ],
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()->toArray()], 401);
        }

        $hashedPassword = Hash::make($password);
        $hasUsername = User::where('username', strtolower($name))->first();

        if (!$hasUsername) {
            $user = User::create([
                'name' => $name,
                'username' => strtolower($name),
                'email' => $email,
                'password' => $hashedPassword,
                'runner_type' => $request->input('tipo_de_corredor'),
            ]);

            return response()->json(['success' => true, 'errors' => null, 'message' => 'Utilizador criado com sucesso'], 201);
        } else {
            $username = $this->generateUniqueUsername($name);

            $user = User::create([
                'name' => $name,
                'username' => $username,
                'email' => $email,
                'password' => $hashedPassword,
                'runner_type' => $request->input('tipo_de_corredor'),
            ]);

            return response()->json(['success' => true, 'errors' => null, 'message' => 'Utilizador criado com sucesso'], 201);
        }
    }

    public function loginUser(Request $request)
    {
        $email = strtolower($request->input('email'));
        $password = $request->input('password');

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);


        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()->toArray()], 401);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => ['email' => ['Email inexistente']]], 401);
        }

        if (!Hash::check($password, $user->password)) {
            return response()->json(['success' => false, 'errors' => ['password' => ['Password inválida']]], 401);
        }

        $token = $user->createToken('authToken')->plainTextToken;
        return response()->json(['success' => true, 'errors' => null, 'token' => $token, 'message' => 'Utilizador logado com sucesso'], 200);
    }

    public function getUser(Request $request)
    {
        $token = $request->bearerToken();
        $user = auth()->user();

        if (!$user) {
            return response()->json(['success' => false, 'user' => null, 'errors' => ['token' => ['Token inválido']]], 401);
        }

        return response()->json(['success' => true, 'token' => $token, 'user' => $user, 'errors' => null, 'message' => 'Informação do utilizador enviada'], 200);
    }

    public function getSpecificUser(Request $request)
    {
        $user = User::where('username', $request->input('username'))->first();

        if (!$user) {
            return response()->json(['success' => false, 'user' => null, 'errors' => ['token' => ['Token inválido']]], 401);
        } else {
            return response()->json(['success' => true, 'user' => $user], 200);
        }
    }

    public function updatePhoto(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => 'Utilizador não encontrado'], 401);
        }

        $userEmail = $user->email;

        $validator = Validator::make($request->all(), [
            'image' => ['required', 'image', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()->toArray()], 401);
        }

        $image = $request->file('image');

        if ($request->has('type')) {
            $type = $request->input('type');
            if ($type === 'profile_photo') {
                $filename = uniqid('profile_photo_') . '.' . $image->getClientOriginalExtension();
                $storagePath = 'profile_photos/';
                $image->move(public_path($storagePath), $filename);

                $finalPath = $storagePath . $filename;

                $user->profile_photo_path = $finalPath;

                $user->save();
                return response()->json(['success' => true, 'errors' => null, 'message' => 'Foto atualizada'], 200);
            } elseif ($type === 'profile_banner') {
                $filename = uniqid('profile_banner_') . '.' . $image->getClientOriginalExtension();
                $storagePath = 'profile_banners/';
                $image->move(public_path($storagePath), $filename);

                $finalPath = $storagePath . $filename;

                $user->profile_banner_path = $finalPath;

                $user->save();
                return response()->json(['success' => true, 'errors' => null, 'message' => 'Foto atualizada'], 200);
            }
        }
    }

    public function removePhoto(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => 'Utilizador não encontrado'], 401);
        }

        if ($request->has('type')) {
            $type = $request->input('type');
            if ($type === 'profile_photo') {
                $user->profile_photo_path = null;
                $user->save();
                return response()->json(['success' => true, 'errors' => null, 'message' => 'Foto removida'], 200);
            } elseif ($type === 'profile_banner') {
                $user->profile_banner_path = null;
                $user->save();
                return response()->json(['success' => true, 'errors' => null, 'message' => 'Banner removido'], 200);
            }
        }
    }

    public function updateCred(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => ['user' => ['Utilizador não encontrado, faz login novamente']]], 401);
        }

        if ($request->filled('name') || $request->filled('password') || $request->filled('newPassword')) {
            if ($request->filled('name') && !$request->filled('password')) {
                $validator = Validator::make($request->all(), [
                    'name' => 'required|string|min:8|max:255',
                ]);

                if ($validator->fails()) {
                    return response()->json(['success' => false, 'errors' => $validator->errors()], 401);
                }

                $user->update([
                    'name' => $request->input('name'),
                ]);

                return response()->json(['success' => true, 'errors' => null, 'message' => 'Nome atualizado', 'nameChanged' => true], 200);
            } else if (!$request->filled('name') && $request->filled('password')) {
                $validator = Validator::make($request->all(), [
                    'password' => 'required|string|min:8',
                ]);

                if ($validator->fails()) {
                    return response()->json(['success' => false, 'errors' => $validator->errors()], 401);
                }

                if (!Hash::check($request->input('password'), $user->password)) {
                    return response()->json(['success' => false, 'errors' => ['password' => ['Password inválida']]], 401);
                }

                $newPasswordValidator = Validator::make($request->all(), [
                    'newPassword' => 'required|string|min:8',
                ]);

                if ($newPasswordValidator->fails()) {
                    return response()->json(['success' => false, 'errors' => $newPasswordValidator->errors()], 401);
                }

                return response()->json(['success' => true, 'errors' => null, 'message' => 'Password atualizada'], 200);
            } else {
                $validator = Validator::make($request->all(), [
                    'name' => 'required|string|min:8|max:255',
                    'password' => 'required|string|min:8',
                ]);

                if ($validator->fails()) {
                    return response()->json(['success' => false, 'errors' => $validator->errors()], 401);
                }

                if (!Hash::check($request->input('password'), $user->password)) {
                    return response()->json(['success' => false, 'errors' => ['password' => ['Password inválida']]], 401);
                }

                $newPasswordValidator = Validator::make($request->all(), [
                    'newPassword' => 'required|string|min:8',
                ]);

                if ($newPasswordValidator->fails()) {
                    return response()->json(['success' => false, 'errors' => $newPasswordValidator->errors()], 401);
                }

                $user->update([
                    'name' => $request->input('name'),
                ]);

                return response()->json(['success' => true, 'errors' => null, 'message' => 'Nome e Password atualizada', 'nameChanged' => true], 200);
            }
        } else {
            return response()->json(['success' => false, 'errors' => ['message' => ['Não há dados para atualizar']]], 400);
        }
    }

    public function updateData(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'errors' => ['user' => ['Utilizador não encontrado, faz login novamente']]], 401);
        }

        $validator = Validator::make($request->all(), [
            'sexo' => [
                'required',
                Rule::in([
                    'male', 'female', 'other'
                ]),
            ],
            'tipo_de_corredor' => [
                'required', Rule::in(['atleta', 'guia']),
            ],
            'distrito' => [
                'required',
                Rule::in([
                    'aveiro', 'beja', 'braga', 'bragança', 'castelo_branco', 'coimbra',
                    'evora', 'faro', 'guarda', 'leiria', 'lisboa', 'portalegre', 'porto',
                    'santarem', 'setubal', 'viana_do_castelo', 'vila_real', 'viseu'
                ]),
            ],
            'privacidade_do_perfil' => [
                'required',
                Rule::in([
                    'true', 'false'
                ]),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 401);
        }

        // UPDATE USER DATA
        $user->sex = $request->input('sexo');
        $user->runner_type = $request->input('tipo_de_corredor');
        $user->district = $request->input('distrito');
        $user->is_profile_public = $request->input('privacidade_do_perfil') === 'true';

        $user->save();

        return response()->json(['success' => true, 'errors' => null, 'message' => 'Dados atualizados'], 200);
    }

    public function resetPassword(Request $request)
    {
        $email = strtolower($request->input('email'));

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()->toArray()], 401);
        }

        $user = User::where('email', $request->input('email'))->first();

        if ($user) {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status == Password::RESET_LINK_SENT) {
                return response()->json(['success' => true, 'errors' => null, 'message' => 'Email de recuperação enviado'], 200);
            }
        } else {
            return response()->json(['success' => false, 'errors' => ['no_user' => 'Utilizador não encontrado com o email introduzido']], 401);
        }
    }

    public function verifyEmail(Request $request)
    {
        $username = strtolower($request->input('username'));
        $user = User::where('username', $request->input('username'))->first();

        if ($user) {
            $user->sendEmailVerificationNotification();
            return response()->json(['success' => true, 'errors' => null, 'message' => 'Email de verificação enviado'], 200);
        } else {
            return response()->json(['success' => false, 'errors' => ['no_user' => 'Utilizador não encontrado com o username introduzido']], 401);
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
