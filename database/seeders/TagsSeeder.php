<?php

namespace Database\Seeders;

use App\Enums\BaseTags;
use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public static function run(): void
    {
        echo 'Seeding tags...';

        foreach (BaseTags::cases() as $tag) {
            Tag::firstOrCreate(['name' => $tag->value]);
        }
        echo 'Tags seeded.';
    }
}
