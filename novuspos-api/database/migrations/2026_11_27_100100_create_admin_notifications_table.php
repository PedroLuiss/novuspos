<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_notifications', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('link')->default('');
            $table->string('icon')->default('campaign');
            $table->string('type', 20)->default('info');
            $table->string('audience')->default('all');
            $table->string('audience_label');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_notifications');
    }
};
