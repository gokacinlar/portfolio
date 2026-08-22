<?php
declare(strict_types=1);

namespace App\Login;

interface LoginM
{
    public function getDsn(): string;
    public function getUsername(): string;
    public function getPassword(): string;
    public function getOptions(): array;
}
