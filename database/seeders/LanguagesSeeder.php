<?php

namespace Database\Seeders;

use App\Enums\Language;
use App\Models\Language as LanguageModel;
use Illuminate\Database\Seeder;

class LanguagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public static function run(): void
    {
        echo 'Seeding languages...';

        foreach (Language::cases() as $language) {
            LanguageModel::firstOrCreate(['name' => $language->value]);
        }

        echo 'Languages seeded.';
    }
}