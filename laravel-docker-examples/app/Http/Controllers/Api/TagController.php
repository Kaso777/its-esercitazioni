<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use App\Http\Resources\NoteResource;
use App\Http\Resources\TagResource;

class TagController extends Controller
{
    public function index()
    {
        return TagResource::collection(Tag::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|unique:tags,name']);
        return new TagResource(Tag::create($data));
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();
        return response()->noContent();
    }
}