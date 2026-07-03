<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TagsSeeder::class,
            LanguagesSeeder::class,
            FillDataSeeder::class,
            TestUserSeeder::class,
//            CredentialsSeeder::class,
        ]);
    }
}
