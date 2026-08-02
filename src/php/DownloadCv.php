<?php
namespace App\Miscellaneous;

use Exception;

class DownloadCv
{

    public function __construct(string $url)
    {
        $this->rateLimitCheck(key: "download_cv", limit: 5, period: 60); # Limit: 5 requests per 60 seconds
        $this->download(input: $url);
    }

    private function download(string $input): void
    {
        try {
            $file = realpath(path: __DIR__ . "/" . $input);
            if (file_exists(filename: $file)) {
                $this->initDownloadCv(file: $file);
            } else {
                throw new Exception(message: "File does not exist: " . $file);
            }
        } catch (Exception $error) {
            throw new Exception(message: "Error while downloading PDF: " . $error->getMessage());
        }
    }

    private function rateLimitCheck(string $key, int $limit, int $period): void
    {
        $dir = __DIR__ . "/RLIMITER";

        if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
            throw new Exception(message: "Unable to create rate limiter directory: " . $dir);
        }

        $filename = $dir . "/" . hash(algo: "sha256", data: $key) . ".txt";
        $ip = $_SERVER["REMOTE_ADDR"];

        if (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
            $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
        }

        if (!filter_var(value: $ip, filter: FILTER_VALIDATE_IP, options: FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6)) {
            die("Error: Invalid IP address");
        }

        $data = [];
        if (file_exists(filename: $filename)) {
            $data = json_decode(json: file_get_contents(filename: $filename), associative: true);
        }

        $current_time = time();

        # Reset count if the period has elapsed
        if (isset($data[$ip]) && $current_time - $data[$ip]["last_access_time"] >= $period) {
            $data[$ip]["count"] = 0;
            $data[$ip]["last_access_time"] = $current_time; # Reset time
        }

        # Check if the limit has been reached
        if (isset($data[$ip]) && $data[$ip]["count"] >= $limit) {
            http_response_code(response_code: 429);
            header(header: "Retry-After: " . ($period - ($current_time - $data[$ip]["last_access_time"])));
            die("Error: Rate limit exceeded");
        }

        # Increment count if not reached
        if (!isset($data[$ip])) {
            $data[$ip] = ["count" => 0, "last_access_time" => $current_time];
        }

        $data[$ip]["count"]++;
        file_put_contents(filename: $filename, data: json_encode(value: $data));
    }

    private function initDownloadCv(string $file): void
    {
        try {
            header(header: "Content-Disposition: attachment; filename=\"" . basename(path: $file) . "\"");
            header(header: "Content-Length: " . filesize(filename: $file));
            $this->setHeaders();
            $this->cleanBuffer();

            readfile(filename: $file);
            exit;
        } catch (\Throwable $error) {
            throw new Exception(message: "Error while downloading PDF: " . $error->getMessage());
        }
    }

    private static function setHeaders(): void
    {
        header(header: "Content-Type: application/pdf");
        header(header: "Content-Description: File Transfer");
        header(header: "X-Content-Type-Options: nosniff");
        header(header: "X-Frame-Options: DENY");
        header(header: "Strict-Transport-Security: max-age=31536000; includeSubDomains");
        header(header: "Referrer-Policy: no-referrer");
        header(header: "Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header(header: "Pragma: no-cache");
        header(header: 'Content-Security-Policy: default-src "self";');
        header(header: "Accept-Ranges: bytes");
        header(header: "Content-Transfer-Encoding: binary");
    }

    private static function cleanBuffer(): void
    {
        ob_clean();
        flush();
    }
}

$url = "../assets/doc/DOO-CV-REDACTED.pdf";
$download = new DownloadCv($url);