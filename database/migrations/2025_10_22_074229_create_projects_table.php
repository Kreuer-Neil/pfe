<?php

use App\Enums\Languages;
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
            $table->string('icon')->default('test_logo.svg'); // Save user project icons using external services?
            $table->text('description')->nullable();
            // Status is a list of posts related to the project
            // $table->text('status')->nullable();
            $table->string('slug',/*24*/)->unique();
            $table->enum('lang', Languages::cases()); // Project languages. Default: User lang
            $table->string('coordinates')->nullable();
            $table->boolean('is_private')->default(true);

            // + hasMany_members
            // + hasMany_tags
            // + hasMany_chatrooms
            // + hasMany_tasks
            // + hasMany_resources

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
