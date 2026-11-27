<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['subject', 'body', 'body_text', 'audience', 'audience_label'])]
class AdminEmail extends Model
{
    use HasFactory;
}
