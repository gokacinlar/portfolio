<?php
declare(strict_types=1);
namespace App\Panel;

require_once dirname(__FILE__) . "/../../vendor/autoload.php";

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
?>
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preload" href="./assets/fonts/Geist.woff2" as="font" type="font/woff2" fetchpriority="high"
        crossorigin="">
    <link rel="icon" type="image/ico" sizes="128x128" href="./assets/images/favicon/favicon.ico">
    <title>Derviş Öksüzoğlu | Admin Panel</title>
</head>

<body
    style="background: var(--clr-one); color: var(--clr-two); min-height: 100dvh; margin: 0; font-family: 'Geist', sans-serif;">
    <main class="d-flex flex-row" style="min-height: 100dvh;">
        <nav
            style="width: 240px; background: var(--clr-eight); padding: 1.5rem; border-right: 1px solid var(--clr-five);">
            <h3 class="fw-bold mb-4">Admin</h3>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
                <li><a href="/php/Panel.php"
                        style="color: var(--clr-two); text-decoration: none; font-weight: 500;">Dashboard</a></li>
            </ul>
        </nav>
        <section style="flex: 1; padding: 2rem;">
            <div class="d-flex flex-row align-items-center justify-content-between mb-4">
                <h1 class="fw-bold">Dashboard</h1>
                <a href="/php/Panel.php?action=logout" class="btn bee-color-btn bg-gradient rounded-5 fw-bold shadow-sm"
                    style="text-decoration: none;">Logout</a>
            </div>
            <p>Welcome, admin. Your session is active.</p>
        </section>
    </main>
</body>

</html>