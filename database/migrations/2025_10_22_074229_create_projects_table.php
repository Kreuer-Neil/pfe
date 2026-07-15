<?php

use App\Enums\Language;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->foreignId('owner_id')->unsigned()->constrained('users', 'id');
            $table->string('name');
            // Turn project icon to ForeignID with use of in-app icons or images, user's choice.
            // See for project banner too (if added).
            $table->string('icon')->default('default_1');
            $table->text('description')->nullable();
            // Status is a collection of posts related to the project
            $table->string('slug',/*24*/)->unique();
            $table->foreignId('language_id')->default(1)->constrained();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_private')->default(true);

            $table->fullText(['name', 'description']);

            $table->softDeletes();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
