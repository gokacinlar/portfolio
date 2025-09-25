<?php

class Cors
{
    private $allowedOrigins;

    public function __construct(array $allowedOrigins)
    {
        $this->allowedOrigins = $allowedOrigins;
    }

    public function handle(): void
    {
        if (isset($_SERVER["HTTP_ORIGIN"]) && in_array(needle: $_SERVER["HTTP_ORIGIN"], haystack: $this->allowedOrigins)) {
            header(header: "Access-Control-Allow-Origin: " . $_SERVER["HTTP_ORIGIN"]);
            header(header: "Access-Control-Allow-Methods: GET, POST, OPTIONS");
            header(header: "Access-Control-Allow-Headers: Content-Type, Authorization");
            header(header: "Access-Control-Allow-Credentials: true");
        }

        // Handle preflight requests
        if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
            http_response_code(response_code: 204);
            exit;
        }
    }
}

$cors = new Cors(allowedOrigins: [
    "https://api.hashnode.com"
]);
$cors->handle();

?>