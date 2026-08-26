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
    public function run(): void
    {
        foreach (Language::cases() as $language) {
            LanguageModel::firstOrCreate(['name' => $language->value]);
        }
    }
}