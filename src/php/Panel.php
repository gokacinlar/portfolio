<?php

declare(strict_types=1);

namespace App\Panel;

require_once __DIR__ . "/AppAutoloader.php";
require_once dirname(__DIR__, 2) . "/vendor/autoload.php";

use App\Bootstrap;
use App\Session\SessionManager;
use App\Login\Authenticator;
use App\Login\DataBaseLoginActions;
use App\Login\DbLoginConfig;

Bootstrap::load();

$session = new SessionManager();
$session->start();

if (!$session->isLoggedIn()) {
    header("Location: /admin.html");
    exit;
}

if (isset($_GET["action"]) && $_GET["action"] === "logout") {
    $auth = new Authenticator(
        (new DataBaseLoginActions(
            new DbLoginConfig(
                dsn: "mysql:host=" . ($_ENV["DB_HOST"] ?? "127.0.0.1") . ";dbname=" . ($_ENV["DB_NAME"] ?? "portfolio_db") . ";charset=utf8mb4",
                username: $_ENV["DB_USER"] ?? "root",
                password: $_ENV["DB_PASS"] ?? "",
            )
        ))->connect(),
        $session
    );
    $auth->logout();
    header("Location: /admin.html");
    exit;
}

PanelApp::run();