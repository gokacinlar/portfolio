<?php
declare(strict_types=1);

namespace App\Session;

final class SessionManager
{
    private const LIFETIME = 259200; # 3 days cookie lifetime

    public function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $this->configure();
        session_start();
    }

    # Cookie config
    private function configure(): void
    {
        ini_set("session.use_strict_mode", "1");
        ini_set("session.use_only_cookies", "1");
        ini_set("session.cookie_httponly", "1");
        ini_set("session.cookie_samesite", "Strict");
        ini_set("session.gc_maxlifetime", (string) self::LIFETIME);

        session_id(bin2hex(random_bytes(32)));
        session_name("PORTFOLIO_ADMIN");
        session_set_cookie_params([
            "lifetime" => self::LIFETIME,
            "path" => "/",
            "httponly" => true,
            "samesite" => "Strict",
        ]);
    }

    public function get(string $key): mixed
    {
        return $_SESSION[$key] ?? null;
    }

    public function set(string $key, mixed $value): void
    {
        $_SESSION[$key] = $value;
    }

    public function isLoggedIn(): bool
    {
        return !empty($_SESSION["authenticated"]) && $_SESSION["authenticated"] === true;
    }

    public function requireAuth(): void
    {
        if (!$this->isLoggedIn()) {
            header("Location: /admin.html");
            exit;
        }
    }

    public function regenerate(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }

    public function destroy(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            return;
        }

        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                "",
                [
                    "expires" => time() - 3600,
                    "path" => $params["path"],
                    "domain" => $params["domain"],
                    "secure" => $params["secure"],
                    "httponly" => $params["httponly"],
                    "samesite" => $params["samesite"] ?? "Strict",
                ]
            );
        }

        session_destroy();
        $this->start();
    }
}
