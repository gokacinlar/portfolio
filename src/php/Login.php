<?php
declare(strict_types=1);
namespace App\Panel;

require_once dirname(__FILE__) . "/../../vendor/autoload.php";

use PDO;
use Throwable;

interface LoginM
{
    public function getDsn(): string;
    public function getUsername(): string;
    public function getPassword(): string;
    public function getOptions(): array;
}

# Base method to connect to DB
interface DbConnection
{
    public function connect(): PDO;
}

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

final class DataBaseLoginActions implements DbConnection
{
    public function __construct(
        private LoginM $login
    ) {
    }

    public function connect(): PDO
    {
        # Default PDO Config
        $defaults = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4", # Change if error occurs in phpMyAdmin default
        ];

        $options = $this->login->getOptions() + $defaults;

        try {
            return new PDO(
                $this->login->getDsn(),
                $this->login->getUsername(),
                $this->login->getPassword(),
                $options
            );
        } catch (Throwable $error) {
            throw $error;
        }
    }
}

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
            $query = $this->db->prepare("SELECT id, password_hash FROM admin_users WHERE username = :username LIMIT 1");
            $query->execute(["username" => $username]);
            $row = $query->fetch();

            if (!$row || !password_verify($password, $row["password_hash"])) {
                return false;
            }

            $this->session->regenerate();
            $this->session->set("authenticated", true);
            $this->session->set("user_id", (int) $row["id"]);

            # Update session on DB
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

/*
 * We get the front-end POST's username & password here.
 * And returns JSON so the fetch() call in TypeScript can parse it.
 */

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

if ($username === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Username and password are required."]);
    exit;
}

try {
    $session = new SessionManager();
    $session->start();

    $dbConfig = new DbLoginConfig(
        dsn: "mysql:host=" . ($_ENV["DB_HOST"] ?? "127.0.0.1") . ";dbname=" . ($_ENV["DB_NAME"] ?? "portfolio_db") . ";charset=utf8mb4",
        username: $_ENV["DB_USER"] ?? "root",
        password: $_ENV["DB_PASS"] ?? "",
    );

    $db = (new DataBaseLoginActions($dbConfig))->connect();
    $auth = new Authenticator($db, $session);

    if ($auth->attempt($username, $password)) {
        echo json_encode(["success" => true, "message" => "Login successful."]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid credentials."]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error."]);
    error_log("Login error: " . $e->getMessage());
}

exit;