<?php
namespace App\Miscellaneous;
use Exception;

class DownloadCv
{
    protected static string $_pdfUrl = "";

    public function __construct(string $url)
    {
        self::$_pdfUrl = $url;
    }

    public function download(string $input): void
    {
        self::initDownloadCv(input: $input);
    }

    private static function initDownloadCv(string $input): void
    {
        $file = $_GET[$input] . ".pdf";

        if (file_exists(filename: $file)) {
            try {
                header(header: "Content-Disposition: attachment; filename=\"" . basename(path: $file) . "\"");
                header(header: "Content-Length: " . filesize(filename: $file));
                header(header: "Content-Type: application/pdf");
                header(header: "Content-Description: File Transfer");
                header(header: "X-Content-Type-Options: nosniff");
                header(header: "X-Frame-Options: DENY");
                header(header: "Strict-Transport-Security: max-age=31536000; includeSubDomains");
                header(header: "Referrer-Policy: no-referrer");
                header(header: "Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
                header(header: "Pragma: no-cache");
                header(header: "Content-Security-Policy: default-src 'self';");
                header(header: "Accept-Ranges: bytes");
                header(header: "Content-Transfer-Encoding: binary");

                # init buffer cleaning
                self::cleanBuffer();
                readfile(filename: $file);
                exit;
            } catch (\Throwable $error) {
                throw new Exception(message: "Error while downloading PDF: " . $error->getMessage());
            }
        } else {
            throw new Exception(message: "File does not exist: " . $file);
        }
    }

    private static function cleanBuffer(): void
    {
        ob_clean();
        flush();
    }
}
