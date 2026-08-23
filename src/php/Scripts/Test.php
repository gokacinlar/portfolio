#!/usr/bin/env php
<?php

# PHPUnit script to use your testcases with a simple CLI
# chmod +x ./Test.php
# ./Test.php <define .php file>
# If it fails to launch due to Windows line endings (^M), simply do dos2unix ./PHpLinter.php

declare(strict_types=1);

require_once __DIR__ . '/../Utilities/LoadVendor.php';
require_once __DIR__ . '/../Utilities/RunProcess.php';

use App\Utilities\LoadVendorCode;
use App\Utilities\ProcessRunner;

interface TestMethods
{
    public function runTest(array $arguments): int;
}

final class Test implements TestMethods
{
    private const PHPUNIT_PATH = __DIR__ . "/../../../vendor/bin/phpunit";

    private ProcessRunner $processRunner;

    public function __construct(ProcessRunner $processRunner)
    {
        $this->processRunner = $processRunner;
    }

    public function runTest(array $arguments): int
    {
        try {
            $phpunit = $this->getPhpUnitPath(self::PHPUNIT_PATH);
            $testArguments = $this->parseArguments($arguments);

            if ($testArguments === []) {
                throw new InvalidArgumentException("Please provide a PHPUnit test file or directory.");
            }

            return $this->processRunner->run([
                $phpunit,
                ...$testArguments,
            ]);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            fwrite(STDERR, "Error: {$exception->getMessage()}\n");
            return 1;
        }
    }

    private function parseArguments(array $arguments): array
    {
        return array_slice($arguments, 1);
    }

    private function getPhpUnitPath(string $vendorPath): string
    {
        $vendor = new LoadVendorCode();

        return $vendor->loadVendorPath($vendorPath);
    }
}

$test = new Test(new ProcessRunner());
exit($test->runTest($argv));