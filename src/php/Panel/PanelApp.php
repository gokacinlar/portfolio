<?php

declare(strict_types=1);

namespace App\Panel;

use PhpSPA\App;
use PhpSPA\Component;
use App\Panel\Layout\PanelLayout;
use App\Panel\Components\DashboardPage;

final class PanelApp
{
    public static function run(): void
    {
        $app = new App(fn() => PanelLayout::render());
        $app->attach(
            (new Component(fn() => DashboardPage::render()))
                ->title("Dashboard")
        );
        $app->run();
    }
}