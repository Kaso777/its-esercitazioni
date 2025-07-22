<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Http\Resources\NoteResource; // Importa la tua NoteResource
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    /**
     * Restituisce tutte le note con le rispettive liste.
     */
    public function index()
    {
        $notes = Note::with('lista')->get(); // 'lista' è il nome della relazione nel Model Note
        return NoteResource::collection($notes);
    }

    /**
     * Crea una nuova nota.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'note'    => 'required|string|max:100',
            'status'  => 'boolean',
            'list_id' => 'required|exists:lists,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $note = Note::create($request->all());
        return new NoteResource($note);
    }

    /**
     * Mostra una singola nota con i dati della lista collegata.
     */
    public function show(Note $note) // Usa la Type Hinting
    {
        $note->load('lista'); // Carica la relazione 'lista'
        return new NoteResource($note);
    }

    /**
     * Aggiorna una nota esistente.
     */
    public function update(Request $request, Note $note) // Usa la Type Hinting
    {
        $validator = Validator::make($request->all(), [
            'note'    => 'sometimes|required|string|max:100',
            'status'  => 'sometimes|boolean',
            'list_id' => 'sometimes|required|exists:lists,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $note->update($request->all());
        return new NoteResource($note);
    }

    /**
     * Fa check della nota.
     */
    public function check(Note $note) // Usa la Type Hinting
    {
        $note->status = true;
        $note->save();
        return new NoteResource($note); // Restituisci la risorsa aggiornata
    }
    /**
     * Uncheck della nota.
     */
    public function uncheck(Note $note) // Usa la Type Hinting
    {
        $note->status = false;
        $note->save();
        return new NoteResource($note); // Restituisci la risorsa aggiornata
    }

    /**
     * Elimina una nota.
     */
    public function destroy(Note $note) // Usa la Type Hinting
    {
        $note->delete();
        return response()->json(null, 204);
    }
}