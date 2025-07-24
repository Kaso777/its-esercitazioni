<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListController;  
use App\Http\Controllers\Api\NoteController;  

// Rotte Resource per le liste
// Rotta per ottenere le liste archiviate
Route::get('lists/archived', [ListController::class, 'archivedLists']);
// Questo creerà le rotte CRUD standard per la risorsa 'lists'
Route::apiResource('lists', ListController::class)->parameters([
    'lists' => 'lista'
]);
// Rotte Custom per le liste (archiviazione)
// È FONDAMENTALE che queste rotte siano definite DOPO la riga `Route::apiResource('lists', ListController::class);`
// Altrimenti, Laravel potrebbe interpretare 'archive' come l'ID di una lista.
Route::patch('lists/{lista}/archive', [ListController::class, 'archive']);
Route::patch('lists/{lista}/unarchive', [ListController::class, 'unarchive']);




// Rotte Resource per le note
// Questo creerà le rotte CRUD standard per la risorsa 'notes'
Route::apiResource('notes', NoteController::class);

// Rotte Custom per le note (check/uncheck)
// È FONDAMENTALE che queste rotte siano definite DOPO la riga `Route::apiResource('notes', NoteController::class);`
// Altrimenti, Laravel potrebbe interpretare 'check' o 'uncheck' come l'ID di una nota.
Route::patch('notes/{note}/check', [NoteController::class, 'check']);
Route::patch('notes/{note}/uncheck', [NoteController::class, 'uncheck']);