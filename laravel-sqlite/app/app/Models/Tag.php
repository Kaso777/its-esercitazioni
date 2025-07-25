<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    // Specifica il nome corretto della tabella nel database
    protected $table = 'tags';
    
    protected $fillable = ['name'];

    // Una tag può essere associata a molte liste tramite una relazione many-to-many
    public function lists()
    {
        return $this->belongsToMany(ListModel::class);
    }
}
