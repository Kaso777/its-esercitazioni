<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lista;
use App\Http\Resources\ListaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ListaController extends Controller
{
    /**
     * Restituisce tutte le liste con le relative note.
     */
    public function index()
    {
        // Recupera tutte le liste e le loro note collegate (eager loading)
        $lists = Lista::with('notes')->get();

        // Restituisce una collezione formattata tramite la Resource
        return ListaResource::collection($lists);
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
        $lista = Lista::create($request->all());

        // Restituisce la risorsa appena creata formattata
        return new ListaResource($lista);
    }

    /**
     * Restituisce una lista specifica (con note collegate).
     */
    public function show(Lista $lista)
    {
        // Carica le note collegate (lazy eager loading)
        $lista->load('notes');

        // Restituisce la lista come risorsa
        return new ListaResource($lista);
    }

    /**
     * Aggiorna i dati di una lista esistente.
     */
    public function update(Request $request, Lista $lista)
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
        return new ListaResource($lista);
    }

    /**
     * Elimina una lista e tutte le note collegate.
     */
    public function destroy(Lista $lista)
    {
        // Elimina la lista
        $lista->delete();

        // Restituisce una risposta vuota con codice 204 (No Content)
        return response()->json(null, 204);
    }
}
