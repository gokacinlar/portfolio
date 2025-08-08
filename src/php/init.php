<?php
declare(strict_types=1);

require __DIR__ . "/vendor/autoload.php";
use Dotenv\Dotenv;

error_reporting(error_level: E_ALL);

ini_set(option: "display_errors", value: "0"); # Set to 1 in dev mode
set_exception_handler(callback: function ($e): never {
    http_response_code(response_code: 500);
    error_log(message: $e);
    echo json_encode(value: ["error" => "Internal Server Error"]);
    exit;
});

header(header: "Content-Type: application/json");
header(header: "Access-Control-Allow-Origin: *");

$dotenv = Dotenv::createImmutable(paths: __DIR__);
$dotenv->load();

$requiredEnv = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASS"];
foreach ($requiredEnv as $key) {
    if (empty($_ENV[$key])) {
        http_response_code(response_code: 500);
        echo json_encode(value: ["error" => "Missing environment variable: $key"]);
        exit;
    }
}

$host = $_ENV["DB_HOST"];
$db = $_ENV["DB_NAME"];
$user = $_ENV["DB_USER"];
$pass = $_ENV["DB_PASS"];

try {
    $pdo = new PDO(dsn: "mysql:host=$host;dbname=$db;charset=utf8mb4", username: $user, password: $pass, options: [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    # We need only "updates" and "writings"
    $allowedTypes = ["update", "writing"];
    $type = $_GET["type"] ?? "update";
    # extra sanitizion
    $type = filter_var(value: $type, filter: FILTER_SANITIZE_STRING);

    # array sanitization
    if (!in_array(needle: $type, haystack: $allowedTypes, strict: true)) {
        http_response_code(response_code: 400);
        echo json_encode(value: ["error" => "Invalid type parameter. Allowed: update, writing"]);
        exit;
    }

    $stmt = $pdo->prepare(query: "SELECT content FROM blog_content WHERE type = :type");
    $stmt->execute(params: ["type" => $type]);

    $results = $stmt->fetchAll();

    $data = array_map(callback: fn($row): mixed => json_decode(json: $row["content"], associative: true), array: $results);

    echo json_encode(value: $data);

} catch (PDOException $e) {
    http_response_code(response_code: 500);
    error_log(message: "Database error: " . $e->getMessage());
    echo json_encode(value: ["error" => "A database error occurred."]);
}