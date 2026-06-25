<?php

namespace Database\Seeders;

use App\Enums\Language;
use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed tags
        TagsSeeder::run();

        FillDataSeeder::run();

        TestUserSeeder::run();

//        CredentialsSeeder::run();
    }
}
