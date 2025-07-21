<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Restituisce tutte le note con le rispettive liste.
     */
    public function index()
    {
        return Note::with('list')->get();
    }

    /**
     * Crea una nuova nota.
     */
    public function store(Request $request)
    {
        // Validazione dei dati
        $validated = $request->validate([
            'note' => 'required|string|max:100',
            'status' => 'boolean',
            'list_id' => 'required|exists:lists,id',
        ]);

        // Creazione e restituzione della nuova nota
        return Note::create($validated);
    }

    /**
     * Mostra una singola nota con i dati della lista collegata.
     */
    public function show(string $id)
    {
        return Note::with('list')->findOrFail($id);
    }

    /**
     * Aggiorna una nota esistente.
     */
    public function update(Request $request, string $id)
    {
        // Validazione dei dati
        $validated = $request->validate([
            'note' => 'sometimes|required|string|max:100',
            'status' => 'sometimes|boolean',
            'list_id' => 'sometimes|required|exists:lists,id',
        ]);

        // Trova la nota e aggiorna i dati
        $note = Note::findOrFail($id);
        $note->update($validated);

        return $note;
    }

    /**
     * Elimina una nota.
     */
    public function destroy(string $id)
    {
        $note = Note::findOrFail($id);
        $note->delete();

        return response()->json(['message' => 'Nota eliminata']);
    }
}
