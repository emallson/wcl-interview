<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CachedParse extends Model
{
    use HasFactory;

    protected $fillable = ['region', 'realm', 'character', 'data'];
    protected $casts = [
    'data' => 'array'
    ];
}
