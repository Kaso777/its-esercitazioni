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
        return $this->belongsTo(ListModel::class, 'list_id');
    }
}