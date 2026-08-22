<?php

declare(strict_types=1);

namespace App\Utilities;

use Dotenv\Dotenv;
use RuntimeException;

final class LoadDotEnv
{
    private static bool $loaded = false;

    public static function load(): void
    {
        if (self::$loaded) {
            return;
        }

        # php/Utilities -> php -> <build root> -> project root
        $projectRoot = dirname(__DIR__, 3);

        if (!is_file($projectRoot . "/.env")) {
            throw new RuntimeException(".ENV files not found.");
        }

        # Load Dotenv
        $dotenv = Dotenv::createImmutable($projectRoot);
        $dotenv->load();

        self::$loaded = true;
    }
}