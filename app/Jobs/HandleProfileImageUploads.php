<?php

namespace App\Jobs;

use File;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;

class HandleProfileImageUploads implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $imageName,
        public string $oldImageName,
        public string $imagePath,
        public string $directory
    )
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $imageManager = ImageManager::usingDriver(Driver::class);
        $scales = ['small' => 32, 'medium' => 64, 'large' => 160];

        foreach ($scales as $key => $scale) {
            $image = $imageManager->decodePath('../storage/app/public/' . $this->imagePath);
            $image->cover($scale, $scale);
            $encoded = $image->encodeUsingFormat(Format::PNG, quality: 65);
            $encoded->save("../storage/app/public/images/$this->directory/$key/$this->imageName.png");
            if ($this->oldImageName) {
                $oldFilePath = "../storage/app/public/images/$this->directory/$key/$this->oldImageName.png";
                if (File::exists($oldFilePath)) {
                    File::delete($oldFilePath);
                }
            }
        }

        if (File::exists("../storage/app/public/images/users/$this->imageName.png")) {
            File::delete("../storage/app/public/images/users/$this->imageName.png");
        }
    }
}
