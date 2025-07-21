<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lista;
use Illuminate\Http\Request;

class ListaController extends Controller
{
    /**
     * Restituisce tutte le liste (con le relative note).
     */
    public function index()
    {
        return Lista::with('notes')->get();
    }

    /**
     * Crea una nuova lista.
     */
    public function store(Request $request)
    {
        // Validazione dei dati in ingresso
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        // Creazione e restituzione della nuova lista
        return Lista::create($validated);
    }

    /**
     * Mostra una lista specifica (con le note collegate).
     */
    public function show(string $id)
    {
        return Lista::with('notes')->findOrFail($id);
    }

    /**
     * Aggiorna una lista esistente.
     */
    public function update(Request $request, string $id)
    {
        // Validazione dei dati
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        // Trova la lista e aggiorna i dati
        $lista = Lista::findOrFail($id);
        $lista->update($validated);

        return $lista;
    }

    /**
     * Elimina una lista e le sue note collegate.
     */
    public function destroy(string $id)
    {
        $lista = Lista::findOrFail($id);
        $lista->delete();

        return response()->json(['message' => 'Lista eliminata']);
    }
}