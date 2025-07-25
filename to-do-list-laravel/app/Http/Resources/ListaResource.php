<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'notes'     => NoteResource::collection($this->whenLoaded('notes')), // Includi le note solo se caricate
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}