#!/usr/bin/env php
<?php

# PHPStan to detect common problems with PHP code, now as a PHP Script
# chmod +x ./PhpLinter.php
# ./PhpLinter.php <define level> <define path>
# If it fails to launch due to Windows line endings (^M), simply do dos2unix ./PHpLinter.php

declare(strict_types=1);

interface PhpLinterMethods
{
    public function run(array $arguments): int;
}

final class PhpLinter implements PhpLinterMethods
{
    private const DEFAULT_LEVEL = "5";
    private const DEFAULT_PATH = "../../php";

    public function run(array $arguments): int
    {
        try {
            [$level, $paths] = $this->parseArguments($arguments);

            $phpstan = $this->getPhpStanPath();
            # Command line arguments
            $command = [
                $phpstan,
                "analyse",
                "--level=" . $level,
                "--error-format=raw",
                ...$paths,
            ];

            return $this->runProcess($command);
        } catch (InvalidArgumentException | RuntimeException $exception) {
            fwrite(STDERR, "Error: {$exception->getMessage()}\n");
            exit(1);
        }
    }

    private function parseArguments(array $arguments): array
    {
        $levelInput = $arguments[1] ?? self::DEFAULT_LEVEL; # If you don't provide a level, it'll be 5
        $paths = array_slice($arguments, 2);

        $level = $this->parseLevel($levelInput);

        if ($paths === []) {
            $paths = [self::DEFAULT_PATH];
        }

        return [$level, $paths];
    }

    # Correct the input
    private function parseLevel(string $input): int|string
    {
        $input = trim($input);

        if (strcasecmp($input, "max") === 0) {
            return "max";
        }

        if (!ctype_digit($input)) {
            throw new InvalidArgumentException(
                "PHPStan level must be between 0 and 10 or set to 'max'."
            );
        }

        $level = (int) $input;

        if (!$this->checkInput($level)) {
            throw new InvalidArgumentException(
                "PHPStan level must be between 0 and 10 or set to 'max'."
            );
        }

        return $level;
    }

    # Base input check
    public function checkInput(int|string $inputToBeChecked): bool
    {
        return match (true) {
            is_int($inputToBeChecked) =>
            $inputToBeChecked >= 0 && $inputToBeChecked <= 10,

            is_string($inputToBeChecked) =>
            strcasecmp(trim($inputToBeChecked), "max") === 0,
        };
    }

    private function getPhpStanPath(): string
    {
        # Don't use __DIR__ as it wont work
        $phpstan = "../../../vendor/bin/phpstan";

        if (!is_file($phpstan) || !is_executable($phpstan)) {
            throw new RuntimeException(
                "PHPStan was not found at {$phpstan}"
            );
        }

        return $phpstan;
    }

    private function runProcess(array $command): int
    {
        $process = proc_open(
            $command,
            [
                0 => STDIN,
                1 => STDOUT,
                2 => STDERR,
            ],
            $pipes
        );

        if (!is_resource($process)) {
            throw new RuntimeException("Could not start PHPStan.");
        }

        return proc_close($process);
    }
}

$linter = new PhpLinter();
exit($linter->run($argv));