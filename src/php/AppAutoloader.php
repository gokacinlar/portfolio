<?php
declare(strict_types=1);

# Resolves App\* classes relative to this directory (php/) so autoloading
# works identically in the source tree and in the built output served by
# Apache, regardless of where vendor/ is located.
# NOTE: AI WRITTEN

spl_autoload_register(static function (string $class): void {
    $prefix = "App\\";

    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $file = __DIR__ . "/" . str_replace("\\", "/", $relative) . ".php";

    if (is_file($file)) {
        require $file;
    }
});
