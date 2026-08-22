<?php
declare(strict_types=1);

namespace App\Login;

final class DbLoginConfig implements LoginM
{
    public function __construct(
        private string $dsn,
        private string $username,
        private string $password,
        private array $options = [] # In case for possible PDO modifications
    ) {
    }

    public function getDsn(): string
    {
        return $this->dsn;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function getOptions(): array
    {
        return $this->options;
    }
}
