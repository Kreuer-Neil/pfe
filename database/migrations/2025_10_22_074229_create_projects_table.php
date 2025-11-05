<?php

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

            $table->foreignId('user_id')->unsigned(); // Owner
            $table->string('name');
            // Turn project icon to ForeignID with use of in-app icons or images, user's choice.
            // See for project banner too (if added).
            $table->string('icon')->nullable(); // Save user project icons using external services?
            $table->text('description');
            $table->text('status');
            $table->boolean('is_private');

            // + hasMany_members
            // + hasMany_tags
            // + hasMany_chatrooms
            // + hasMany_tasks
            // + hasMany_ressources

            // TODO add perms (users->can_post_ressources (user_id on created ressource to allow edit), moderators->can_manage_tasks (edit/delete), etc.)

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
