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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description');

            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            // Repeatable task setting model deletition in cascade will mainly be managed by jobs or the delete setting, since some users would like to keep X future tasks (for the rest of the month, or ancient ones)
//            $table->foreignId('repeatable_task_setting_id')->nullable()->constrained()->cascadeOnDelete();

            $table->dateTime('starting_at');
            $table->dateTime('ending_at');

            $table->softDeletes();
            $table->timestamps();
        });

        /* TODO for june
        Schema::create('repeatable_task_settings', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description');

            $table->foreignId('project_id')->constrained()->cascadeOnDelete();

            $table->dateTime('starting_at');
            $table->dateTime('ending_at');

            // * Model datas for the repeatables
            // Repetition rate
            $table->foreignId('repeated_on')->constrained()->nullOnDelete();

            // Task starting_at and ending_at
            $table->time('task_starting_at');
            $table->time('task_ending_at');

            // Task assignees cannot be put here, since it needs to be dynamical to


            $table->softDeletes();
            $table->timestamps();
        });*/
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
//        Schema::dropIfExists('repeatable_task_settings');
    }
};
