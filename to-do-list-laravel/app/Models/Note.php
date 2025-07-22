<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    // Campi che possono essere assegnati in massa

        protected $fillable = ['note', 'status', 'list_id'];


    // Una nota appartiene a una lista
    public function lista()
    {
        // Laravel userà 'list_id' come chiave esterna, invece di dedurla da 'Lista' → 'lista_id'
        return $this->belongsTo(Lista::class, 'list_id');
    }
}
