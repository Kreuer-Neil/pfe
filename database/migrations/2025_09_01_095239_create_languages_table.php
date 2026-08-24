<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique();

            //            $table->timestamps();
        });

        // users.language_id (preferred app locale) is added here, not in create_users_table,
        // since users migrates before languages and needs the target table to exist first.
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('language_id')->nullable()->after('password')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('language_id');
        });

        Schema::dropIfExists('languages');
    }
};
