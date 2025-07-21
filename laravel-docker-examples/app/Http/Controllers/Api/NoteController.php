<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;
use App\Http\Resources\NoteResource;
use App\Http\Resources\TagResource;

class NoteController extends Controller
{
    /**
     * Restituisce una lista paginata di note con i relativi tag.
     */
    public function index()
    {
        // Recupera le note con i tag associati, ordinate dalla più recente, e le restituisce in formato risorsa
        return NoteResource::collection(
            Note::with('tags')->latest()->paginate(20)
        );
    }

    /**
     * Salva una nuova nota nel database.
     */
    public function store(Request $request)
    {
        // Valida i dati in ingresso
        $data = $request->validate([
            'title' => 'required|string|max:255',      // Il titolo è obbligatorio
            'body'  => 'nullable|string',              // Il corpo è opzionale
            'tags'  => 'array',                        // I tag devono essere un array (opzionale)
            'tags.*'=> 'integer|exists:tags,id',       // Ogni tag deve essere un ID valido esistente
        ]);

        // Crea la nota con i dati validati
        $note = Note::create($data);

        // Associa i tag alla nota (se presenti)
        $note->tags()->sync($data['tags'] ?? []);

        // Restituisce la risorsa della nota appena creata, inclusi i tag
        return new NoteResource($note->load('tags'));
    }

    /**
     * Restituisce una singola nota (con i suoi tag).
     */
    public function show(Note $note)
    {
        // Carica anche i tag associati alla nota e restituisce la risorsa
        return new NoteResource($note->load('tags'));
    }

    /**
     * Aggiorna una nota esistente.
     */
    public function update(Request $request, Note $note)
    {
        // Valida i dati ricevuti (tutti opzionali ma con regole specifiche)
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'body'  => 'sometimes|nullable|string',
            'tags'  => 'sometimes|array',
            'tags.*'=> 'integer|exists:tags,id',
        ]);

        // Aggiorna i campi della nota
        $note->update($data);

        // Se sono stati inviati i tag, aggiorna anche la relazione molti-a-molti
        if (array_key_exists('tags', $data)) {
            $note->tags()->sync($data['tags']);
        }

        // Restituisce la nota aggiornata con i tag
        return new NoteResource($note->load('tags'));
    }

    /**
     * Elimina una nota dal database.
     */
    public function destroy(Note $note)
    {
        // Cancella la nota
        $note->delete();

        // Restituisce una risposta HTTP 204 (no content)
        return response()->noContent();
    }
}
