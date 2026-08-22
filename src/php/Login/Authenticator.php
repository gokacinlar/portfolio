<?php
declare(strict_types=1);

namespace App\Login;

use PDO;
use Throwable;
use App\Session\SessionManager;

final class Authenticator
{
    private PDO $db;
    private SessionManager $session;

    public function __construct(PDO $db, SessionManager $session)
    {
        $this->db = $db;
        $this->session = $session;
    }

    public function attempt(string $username, string $password): bool
    {
        $username = trim($username);

        if ($username === "" || $password === "") {
            return false;
        }

        try {
            # Main query to match admin login
            $query = $this->db->prepare("SELECT id, password_hash FROM admin_users WHERE username = :username LIMIT 1"); # Only I exist in this place!
            $query->execute(["username" => $username]);
            $row = $query->fetch();

            # Check hash of the providedp password
            if (!$row || !password_verify($password, $row["password_hash"])) {
                return false;
            }

            $this->session->regenerate();
            $this->session->set("authenticated", true);
            $this->session->set("user_id", (int) $row["id"]);

            # Update session last login time on DB
            $update = $this->db->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = :id");
            $update->execute(["id" => $row["id"]]);

            return true;
        } catch (Throwable) {
            return false;
        }
    }

    public function logout(): void
    {
        $this->session->destroy();
    }

    public function isLoggedIn(): bool
    {
        return $this->session->isLoggedIn();
    }
}
