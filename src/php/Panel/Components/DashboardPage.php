<?php

declare(strict_types=1);

namespace App\Panel\Components;

final class DashboardPage
{
    public static function render(): string
    {

        return <<<HTML
        <section class="p-4">
            <div class="d-flex flex-row align-items-center justify-content-between mb-4">
                <h1 class="fw-bold">Dashboard</h1>
                <a href="?action=logout"
                    class="btn bee-color-btn bg-gradient rounded-5 fw-bold shadow-sm text-decoration-none">Logout</a>
            </div>
            <p>Welcome, admin. Your session is active.</p>
        </section>
        HTML;
    }
}
