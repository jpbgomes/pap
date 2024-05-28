<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\RaceController;
use App\Http\Controllers\RacePairController;
use App\Http\Controllers\RaceParticipantController;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Broadcast::routes();
Broadcast::routes(['middleware' => ['auth:api']]);

Route::get('/', [Controller::class, 'loadHomePage']);
Route::get('/home', [Controller::class, 'loadHomePage'])->name('home');
Route::get('/welcome', [Controller::class, 'loadHomePage'])->name('welcome');
Route::get('/public', [Controller::class, 'loadHomePage'])->name('public');

Route::get('/faq', function () {
    return view('faq');
})->name('faq');

Route::get('/faq#runner_type', function () {
    return view('faq');
})->name('faq/runner_type');

Route::get('/faq#condition', function () {
    return view('faq');
})->name('faq/condition');

Route::get('/create_races', function () {
    return view('races.race_creation');
})->name('create_races');
// })->name('create_races')->middleware('can:create_races');

Route::get('/races', [RaceController::class, 'getRaces'])->name('races');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/join_race/{race_id}', [RaceParticipantController::class, 'joinRace'])->name('join_race');

    Route::get('/leave_race/{race_id}', [RaceParticipantController::class, 'leaveRace'])->name('leave_race');
    Route::get('/make_pairs', [RacePairController::class, 'loadMakePage'])->name('make_pairs');

    Route::get('/pairs', [RacePairController::class, 'loadPairsPage'])->name('pairs');
    Route::get('/join_pair/{race_id}/{athlete_id}/{guide_id}', [RacePairController::class, 'joinPair'])->name('join_pair');
    Route::get('/leave_pair/{race_id}/{athlete_id}/{guide_id}', [RacePairController::class, 'leavePair'])->name('leave_pair');

    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    Route::get('/chat/{id}', [ChatController::class, 'loadChatPage'])->name('chat');
});

Route::get('/services', function () {
    return view('services');
})->name('services');

Route::get('/biography', function () {
    return view('biography');
})->name('biography');

// EMAIL VERIFICATION

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Link de verificação enviado!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

// FORGOT PASSWORD

Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->middleware('guest')->name('password.request');
