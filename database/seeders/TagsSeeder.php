<?php

namespace Database\Seeders;

use App\Enums\BaseTags;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (BaseTags::cases() as $tag) {
            Tag::firstOrCreate(['name' => $tag->value]);
        }
    }
}
