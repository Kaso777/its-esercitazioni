<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lista extends Model
{

    // Specifica il nome corretto della tabella nel database
    protected $table = 'lists';
    
    protected $fillable = ['name'];

    // Una lista ha molte note
    public function notes()
    {
        return $this->hasMany(Note::class, 'list_id');
    }
}