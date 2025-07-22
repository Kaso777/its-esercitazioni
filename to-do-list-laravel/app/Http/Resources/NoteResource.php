<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'noteText'    => $this->note, // Ho rinominato 'note' a 'noteText' per chiarezza nell'API
            'status'      => (bool) $this->status,
            'listId'      => $this->list_id,
            'lista'       => new ListaResource($this->whenLoaded('lista')),
            'createdAt'   => $this->created_at,
            'updatedAt'   => $this->updated_at,
        ];
    }
}
