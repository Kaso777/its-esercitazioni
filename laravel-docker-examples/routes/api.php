<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\TagController;

Route::apiResource('notes', NoteController::class);
Route::apiResource('tags',  TagController::class)->only(['index','store','destroy']);