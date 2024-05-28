<?php

use App\Http\Controllers\Api\AbilityController;
use App\Http\Controllers\Api\GeneralDataController;
use App\Http\Controllers\Api\RaceController;
use App\Http\Controllers\Api\RacePairController;
use App\Http\Controllers\Api\RaceParticipantController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [UserController::class, 'createUser']);
Route::post('/login', [UserController::class, 'loginUser']);
Route::post('/updatePhoto', [UserController::class, 'updatePhoto'])->middleware('auth:sanctum');
Route::post('/removePhoto', [UserController::class, 'removePhoto'])->middleware('auth:sanctum');
Route::post('/updateCred', [UserController::class, 'updateCred'])->middleware('auth:sanctum');
Route::post('/updateData', [UserController::class, 'updateData'])->middleware('auth:sanctum');

Route::post('/resetPassword', [UserController::class, 'resetPassword']);
Route::post('/verifyEmail', [UserController::class, 'verifyEmail']);

Route::get('/getUser', [UserController::class, 'getUser'])->middleware('auth:sanctum');
Route::get('/getSpecificUser', [UserController::class, 'getSpecificUser'])->middleware('auth:sanctum');

Route::get('/checkToken', [UserController::class, 'checkToken'])->middleware('auth:sanctum');
Route::get('/getAbilities', [AbilityController::class, 'getAbilities'])->middleware('auth:sanctum');

Route::post('/createRace', [RaceController::class, 'createRace'])->middleware('auth:sanctum');
Route::get('/races', [RaceController::class, 'getRaces']);

Route::get('/stories', [StoryController::class, 'getStories']);

Route::post('/joinRace', [RaceParticipantController::class, 'joinRace'])->middleware('auth:sanctum');
Route::post('/leaveRace', [RaceParticipantController::class, 'leaveRace'])->middleware('auth:sanctum');

Route::get('/getPairs', [RacePairController::class, 'getPairs'])->middleware('auth:sanctum');
Route::post('/joinPair', [RacePairController::class, 'joinPair'])->middleware('auth:sanctum');
