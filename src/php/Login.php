<?php
declare(strict_types=1);

namespace App\Login;

require_once __DIR__ . "/AppAutoloader.php";
require_once __DIR__ . "/vendor/autoload.php";

use Throwable;
use App\Session\SessionManager;
use App\Utilities\LoadDotEnv;

LoadDotEnv::load();

/*
 * We get the front-end POST's username & password here.
 * And returns JSON so the fetch() call in TypeScript can parse it to redirect to panel.
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

    # To-do: Do a better job at handling exceptions around login credentials here
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
    echo json_encode(["success" => false, "message" => "Bad login!"]);
    error_log("Login error: " . $e->getMessage());
}

exit;