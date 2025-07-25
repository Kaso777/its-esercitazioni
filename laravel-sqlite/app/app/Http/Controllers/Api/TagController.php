<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ListModel;
use App\Http\Resources\TagResource;

class TagController extends Controller
{
    /**
     * Restituisce tutti i tag.
     */
    public function index()
    {
        return response()->json(Tag::all());
    }

    /**
     * Crea un nuovo tag.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    // Trova o crea il tag
    $tag = Tag::firstOrCreate(['name' => $validated['name']]);

    return new TagResource($tag);
}

    /**
     * Mostra un tag specifico.
     */
    public function show(Tag $tag)
    {
        return response()->json($tag);
    }

    /**
     * Aggiorna un tag esistente.
     */
    public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $tag = Tag::findOrFail($id);
    $tag->name = $request->name;
    $tag->save();

    return response()->json($tag);
}


    /**
     * Elimina un tag.
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->json(null, 204);
    }

    /**
     * Aggiunge un tag a una lista.
     */
    public function attachTag(Request $request, ListModel $lista, Tag $tag)
    {
        $lista->tags()->attach($tag->id);
        return response()->json(['message' => 'Tag aggiunto con successo']);
    }

    /**
     * Rimuove un tag da una lista.
     */
    public function detachTag(ListModel $lista, Tag $tag)
    {
        $lista->tags()->detach($tag->id);
        return response()->json(['message' => 'Tag rimosso con successo']);
    }

    
 //crea un nuovo tag e lo collega a una lista
public function storeAndAttach(Request $request, ListModel $lista)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $tag = Tag::firstOrCreate(['name' => $validated['name']]);

    // Collega il tag alla lista (evita duplicati con syncWithoutDetaching)
    $lista->tags()->syncWithoutDetaching([$tag->id]);

    return new TagResource($tag);
}




}