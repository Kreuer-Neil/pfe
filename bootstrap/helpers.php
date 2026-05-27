<?php

if (!function_exists('getImagePaths')) {

    /**
     * Gets the image paths using the image type and the image's slug as reference.
     * Returns false if `$imageType` is invalid
     *
     * Valid `$imageType` values: `'userProfile'`, `'projectProfile'`, `'projectBanner'`,
     */
    function getImagePaths(
        string $imageType,
        string $slug
    ): array|false
    {
        // TODO fix function
        switch ($imageType) {
            case 'userProfile':
                // Where the files are stocked
                $basePath = 'user-profile';
                // Gets the paths to
                $path1 = asset($basePath . 'small' . $slug);
                $path2 = asset($basePath . 'medium' . $slug);
                $path3 = asset($basePath . 'large' . $slug);
                return [
                    'small' => [
                        'path' => $path1,
                        'size' => '32/32',
                        'width' => '32',
                        'height' => '32',
                    ],
                    'medium' => [
                        'path' => $path2,
                        'size' => '64/64',
                        'width' => '64',
                        'height' => '64',
                    ],
                    'large' => [
                        'path' => $path3,
                        'size' => '128/128',
                        'width' => '128',
                        'height' => '128',
                    ],
                ];

            case 'project_profile':
                // Where the files are stocked
                $basePath = 'proj-profile';
                // Gets the paths to
                $path1 = asset($basePath . 'small' . $slug);
                $path2 = asset($basePath . 'medium' . $slug);
                $path3 = asset($basePath . 'large' . $slug);
                return [
                    'small' => [
                        'path' => $path1,
                        'size' => '32/32',
                        'width' => '32',
                        'height' => '32',
                    ],
                    'medium' => [
                        'path' => $path2,
                        'size' => '64/64',
                        'width' => '64',
                        'height' => '64',
                    ],
                    'large' => [
                        'path' => $path3,
                        'size' => '128/128',
                        'width' => '128',
                        'height' => '128',
                    ],
                ];

            // If imageType doesn't correspond to any type registered
            default:
                return false;
        }
    }
}
