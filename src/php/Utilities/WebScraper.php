<?php
header(header: "Access-Control-Allow-Headers: Content-Type");
header(header: "Content-Type: text/plain; charset=utf-8");

require_once dirname(path: __FILE__) . "../../vendor/autoload.php";

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class WebScraper
{
    private string $targetUrl;
    private Client $client;

    public function __construct(string $url)
    {
        $this->targetUrl = $url;
        $this->client = new Client(config: [
            "headers" => [
                "User-Agent" => "Mozilla/5.0",
                "Accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            ],
            "allow_redirects" => true,
            "http_errors" => false,
        ]);
    }

    public function fetchContent(): string
    {
        try {
            $response = $this->client->get(uri: $this->targetUrl);
            $status = $response->getStatusCode();

            if ($status < 200 || $status >= 300) {
                return "HTTP error: {$status}";
            }

            return (string) $response->getBody();
        } catch (RequestException $e) {
            return "HTTP client error: " . $e->getMessage();
        }
    }

    public function getDataByClass(array $classNames): array
    {
        $content = $this->fetchContent();

        # init error checking
        if (
            str_starts_with(haystack: $content, needle: "HTTP error:") ||
            str_starts_with(haystack: $content, needle: "HTTP client error:")
        ) {
            return [];
        }
        ;

        $hasAnyClass = false;

        foreach ($classNames as $c) {
            if (str_contains(haystack: $content, needle: $c)) {
                $hasAnyClass = true;
                break;
            }
        }

        if (!$hasAnyClass) {
            return [];
        }

        $dom = new DOMDocument();
        @$dom->loadHTML(source: $content);

        $xpathObj = new DOMXPath(document: $dom);
        $data = [];

        foreach ($classNames as $className) {
            # Get the elements via their class names
            $xpath = "//*[contains(concat(' ', normalize-space(@class), ' '), ' {$className} ')]";

            $elements = $xpathObj->query(expression: $xpath);

            if ($elements === false) {
                continue;
            }

            foreach ($elements as $element) {
                $text = trim(string: $element->textContent);
                # double check to ensure the output is a version number
                if ($text !== "" && version_compare(version1: $text, version2: "0.0.1", operator: ">=")) {
                    $data[] = $text;
                }
            }
        }

        return $data;
    }
}

# My portfolio URL
$url = "https://github.com/gokacinlar/portfolio";
$scraper = new WebScraper(url: $url);
$classData = $scraper->getDataByClass(classNames: ["css-truncate"]);

# print_r(value: $classData[0]);
echo json_encode(value: $classData[0] ?? ""); # get the first index of the result (a string)
exit;