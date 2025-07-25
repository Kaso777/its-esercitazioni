<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListModel extends Model
{

    // Specifica il nome corretto della tabella nel database
    protected $table = 'lists';
    
    protected $fillable = ['name', 'archived'];


    // Una lista ha molte note
    public function notes()
    {
        return $this->hasMany(Note::class, 'list_id');
    }

    // Una lista può avere molte etichette tramite una relazione many-to-many
    public function tags()
{
    return $this->belongsToMany(Tag::class, 'list_tag', 'list_id', 'tag_id');
}

}