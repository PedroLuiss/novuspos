<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'description', 'link', 'link_label', 'icon', 'type', 'audience', 'audience_label'])]
class AdminNotification extends Model
{
    use HasFactory;
}
