<?php
declare(strict_types=1);

namespace App\Login;

use PDO;
use Throwable;

final class DataBaseLoginActions implements DbConnection
{
    public function __construct(
        private LoginM $login
    ) {
    }

    public function connect(): PDO
    {
        # Default PDO Config
        $defaults = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4", # Change if error occurs in phpMyAdmin default "utf8mb4_ci"
        ];

        $options = $this->login->getOptions() + $defaults;

        try {
            return new PDO(
                $this->login->getDsn(),
                $this->login->getUsername(),
                $this->login->getPassword(),
                $options
            );
        } catch (Throwable $error) {
            throw $error;
        }
    }
}
