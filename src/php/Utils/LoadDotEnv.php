<?php

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

        $projectRoot = dirname(__DIR__, 2);

        if (!is_file($projectRoot . "/.env")) {
            throw new RuntimeException(".ENV files not found.");
        }

        # Load Dotenv
        $dotenv = Dotenv::createImmutable($projectRoot);
        $dotenv->load();

        self::$loaded = true;
    }
}