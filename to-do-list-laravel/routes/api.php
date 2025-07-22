<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListaController; // Assicurati che il nome sia corretto (es. App\Http\Controllers\Api\ListaController)
use App\Http\Controllers\Api\NoteController;  // Assicurati che il nome sia corretto (es. App\Http\Controllers\Api\NoteController)

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Qui puoi registrare le rotte API per la tua applicazione. Queste rotte
| sono caricate dal RouteServiceProvider e tutte saranno assegnate al
| gruppo di middleware "api".
|
*/

// Questa è una rotta di default per ottenere l'utente autenticato (spesso presente in Laravel)
//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

// --- ROTTE DELLA TUA TO-DO LIST ---

// Rotte Resource per le liste
// Questo creerà le rotte CRUD standard per la risorsa 'lists'
Route::apiResource('lists', ListaController::class);

// Rotte Resource per le note
// Questo creerà le rotte CRUD standard per la risorsa 'notes'
Route::apiResource('notes', NoteController::class);

// Rotte Custom per le note (check/uncheck)
// È FONDAMENTALE che queste rotte siano definite DOPO la riga `Route::apiResource('notes', NoteController::class);`
// Altrimenti, Laravel potrebbe interpretare 'check' o 'uncheck' come l'ID di una nota.
Route::patch('notes/{note}/check', [NoteController::class, 'check']);
Route::patch('notes/{note}/uncheck', [NoteController::class, 'uncheck']);