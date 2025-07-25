<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ListModel;
use App\Http\Resources\ListResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Tag;

class ListController extends Controller
{
    /**
     * Restituisce tutte le liste con le relative note.
     */
    public function index()
    {
        // Recupera tutte le liste e le loro note collegate (eager loading)
        $lists = ListModel::with(['notes', 'tags'])->get();;

        // Restituisce una collezione formattata tramite la Resource
        return ListResource::collection($lists);
    }

    /**
     * Crea una nuova lista.
     */
    public function store(Request $request)
    {
        // Validazione dei dati in ingresso
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
        ]);

        // Se la validazione fallisce, restituisce gli errori con codice 422
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Crea una nuova lista con i dati validati
        $lista = ListModel::create($request->all());

        // Restituisce la risorsa appena creata formattata
        return new ListResource($lista);
    }

    /**
     * Restituisce una lista specifica (con note collegate).
     */
    public function show(ListModel $lista)
    {
        // Carica le note collegate (lazy eager loading)
        $lista->load(['notes', 'tags']);

        // Restituisce la lista come risorsa
        return new ListResource($lista);
    }

    /**
     * Aggiorna i dati di una lista esistente.
     */
    public function update(Request $request, ListModel $lista)
    {
        // Validazione dei dati ricevuti
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
        ]);

        // In caso di errore nella validazione, restituisce risposta con codice 422
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Aggiorna i dati della lista
        $lista->update($request->all());

        // Restituisce la lista aggiornata
        return new ListResource($lista);
    }

    /**
     * Elimina una lista e tutte le note collegate.
     */
    public function destroy(ListModel $lista)
    {
        // Elimina la lista
        $lista->delete();

        // Restituisce una risposta vuota con codice 204 (No Content)
        return response()->json(null, 204);
    }

    /**
     * Archivia una lista.
     */
    public function archive(ListModel $lista)
    {
        $lista->archived = true;
        $lista->save();

        return response()->json(['message' => 'Lista archiviata con successo']);
    }

    /**
     * Disarchivia una lista.
     */
    public function unarchive(ListModel $lista)
    {
        $lista->archived = false;
        $lista->save();

        return response()->json(['message' => 'Lista disarchiviata con successo']);
    }

    /**
     * Restituisce le liste archiviate.
     */
    public function archivedLists()
    {
        $archivedLists = ListModel::with(['notes', 'tags'])->where('archived', true)->get();
        return ListResource::collection($archivedLists);
    }

    public function attachTag(ListModel $lista, Tag $tag)
    {
        $lista->tags()->attach($tag->id);
        return response()->json(['message' => 'Tag associato con successo']);
    }

    public function detachTag(ListModel $lista, Tag $tag)
    {
        $lista->tags()->detach($tag->id);
        return response()->json(['message' => 'Tag rimosso con successo']);
    }
}
