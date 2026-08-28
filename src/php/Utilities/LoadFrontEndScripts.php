<?php
declare(strict_types=1);

namespace App\Utilities;

use InvalidArgumentException;
use RuntimeException;

interface FrontEndScriptsMethods
{
    public function load(string $url);
}

class LoadFrontEndScripts
{
    private static bool $loaded = false;
    private const ALLOWED_SCRIPTS = [
        "userScript" => "../scriptlist.php",
    ];

    public static function load(string $scriptKey)
    {
        if (self::$loaded) {
            return;
        }

        if (!array_key_exists($scriptKey, self::ALLOWED_SCRIPTS)) {
            throw new InvalidArgumentException("Unknown script identifier: " . $scriptKey);
        }

        $url = self::ALLOWED_SCRIPTS[$scriptKey];

        if (!is_file($url) || !is_readable($url)) {
            throw new RuntimeException("Script file not found or unreadable at: " . $url);
        }

        self::$loaded = true;
        return require($url);
    }
}