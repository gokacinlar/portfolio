<?php
declare(strict_types=1);

namespace App\Login;

use PDO;

# Base method to connect to DB
interface DbConnection
{
    public function connect(): PDO;
}
