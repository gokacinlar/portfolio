<?php

declare(strict_types=1);

namespace App\Panel\Layout;

final class PanelLayout
{
    public static function render(): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html lang="en" data-bs-theme="dark">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" type="image/ico" sizes="128x128" href="./assets/images/favicon/favicon.ico">
            <link rel="preload" href="./assets/fonts/Geist.woff2" as="font" type="font/woff2" fetchpriority="high" crossorigin="">
            <title>Derviş Öksüzoğlu | Admin Panel</title>
        </head>
        <body
            style="background: var(--clr-one); color: var(--clr-two); min-height: 100dvh; margin: 0; font-family: 'Geist', sans-serif;">
            <div class="d-flex flex-row" style="min-height: 100dvh;">
                <nav
                    style="width: 240px; background: var(--clr-eight); padding: 1.5rem; border-right: 1px solid var(--clr-five);">
                    <h3 class="fw-bold mb-4">Admin</h3>
                    <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
                        <li><a href="?route=/"
                                style="color: var(--clr-two); text-decoration: none; font-weight: 500;">Dashboard</a>
                        </li>
                    </ul>
                </nav>
                <main id="app" class="flex-1" style="flex: 1; padding: 2rem;"></main>
            </div>
        </body>
        </html>
        HTML;
    }
}
