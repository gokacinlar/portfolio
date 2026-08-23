<?php

declare(strict_types=1);

namespace App\Utilities;

use RuntimeException;

final class ProcessRunner
{
    /**
     * @param array<int, string> $command
     */
    public function run(array $command): int
    {
        if ($command === []) {
            throw new RuntimeException("Please provide a command.");
        }

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
            throw new RuntimeException(
                "Could not start process: {$command[0]}"
            );
        }

        return proc_close($process);
    }
}