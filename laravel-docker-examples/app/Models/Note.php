<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['title', 'body'];

    public function tags()
    {
        return $this -> belongsToMany(Tag::class);
    }
}
