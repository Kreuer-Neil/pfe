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
        Schema::create('poll_participations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('project_poll_id')->constrained()->cascadeOnDelete();
            // If user choose to skip vote (because admin that doesn't want to influence votes/no preferences and would like to get rid of the poll in the "feed")
            $table->foreignId('poll_choice_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // One row per (poll, user, choice) - a `multi` poll just means a user can have more than one row here.
            $table->unique(['project_poll_id', 'user_id', 'poll_choice_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poll_participations');
    }
};
