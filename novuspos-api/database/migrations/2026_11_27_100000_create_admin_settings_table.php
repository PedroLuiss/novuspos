<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_settings', function (Blueprint $table): void {
            $table->id();
            $table->string('company_name');
            $table->string('contact_email');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('login_path')->default('/acceso-maestro');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_settings');
    }
};
