<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Http\Resources\NoteResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    /**
     * Restituisce tutte le note con le rispettive liste.
     */
    public function index()
    {
        $notes = Note::with('lista')->get();
        return NoteResource::collection($notes);
    }

    /**
     * Crea una nuova nota.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'note'     => 'required|string|max:100',
            'status'   => 'boolean',
            'list_id'  => 'required|exists:lists,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $note = Note::create([
            'note'     => $request->note,
            'status'   => $request->status ?? false,
            'list_id'  => $request->list_id,
        ]);

        return new NoteResource($note);
    }

    /**
     * Mostra una singola nota con la lista collegata.
     */
    public function show(Note $note)
    {
        $note->load('lista');
        return new NoteResource($note);
    }

    /**
     * Aggiorna una nota esistente.
     */
    public function update(Request $request, Note $note)
    {
        $validator = Validator::make($request->all(), [
            'note'     => 'sometimes|required|string|max:100',
            'status'   => 'sometimes|boolean',
            'list_id'  => 'sometimes|required|exists:lists,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $note->update($request->only(['note', 'status', 'list_id']));

        return new NoteResource($note);
    }

    /**
     * Check della nota.
     */
    public function check(Note $note)
    {
        $note->status = true;
        $note->save();

        return new NoteResource($note);
    }

    /**
     * Uncheck della nota.
     */
    public function uncheck(Note $note)
    {
        $note->status = false;
        $note->save();

        return new NoteResource($note);
    }

    /**
     * Elimina una nota.
     */
    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json(null, 204);
    }
}
