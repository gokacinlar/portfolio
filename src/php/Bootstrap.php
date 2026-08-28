<?php

declare(strict_types=1);

namespace App;

use App\Utilities\LoadDotEnv;
use App\Utilities\LoadFrontEndScripts;
use RuntimeException;

final class Bootstrap
{
    private static bool $loaded = false;

    public static function load(): void
    {
        if (self::$loaded) {
            return;
        }

        $vendor = dirname(__DIR__, 2) . "/vendor/autoload.php";
        if (!is_file($vendor)) {
            throw new RuntimeException("vendor/autoload.php not found at: {$vendor}");
        }
        require_once $vendor;

        LoadDotEnv::load();
        LoadFrontEndScripts::load("../scriptlist.php");

        self::$loaded = true;
    }
}
