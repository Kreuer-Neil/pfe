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
        Schema::create('project_polls', function (Blueprint $table) {
            $table->id();

            //Poll creator
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('title');

            // If it's a multiple possible choices poll
            $table->boolean('multi')->default(false);

            // Choices live in poll_choices (see create_poll_choices_table) - at least 2 required, enforced in the request validation, not here.

            $table->dateTime('end_date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_polls');
    }
};
