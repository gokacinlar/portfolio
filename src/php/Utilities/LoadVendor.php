<?php

declare(strict_types=1);

namespace App\Utilities;

use RuntimeException;

final class LoadVendorCode
{
    public function loadVendorPath(string $vendorPath): string
    {
        if (!is_file($vendorPath)) {
            throw new RuntimeException(
                "Vendor library was not found at {$vendorPath}"
            );
        }

        if (!is_readable($vendorPath)) {
            throw new RuntimeException(
                "Vendor library is not readable at {$vendorPath}"
            );
        }

        if (!is_executable($vendorPath)) {
            throw new RuntimeException(
                "Vendor library is not executable at {$vendorPath}"
            );
        }

        return $vendorPath;
    }
}