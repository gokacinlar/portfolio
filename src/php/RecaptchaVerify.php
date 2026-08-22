<?php
namespace App\Security;

require_once dirname(__FILE__) . "/vendor/autoload.php";

use Dotenv\Dotenv;
use GuzzleHttp\Client;
use Exception;
use InvalidArgumentException;

class CaptchaVerifier
{
    private string $buttonName;
    private string $secretKey;
    private string $verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    private Client $httpClient;

    public function __construct(string $secretKey, string $buttonName = "captcha_submit")
    {
        $this->buttonName = $buttonName;
        $this->secretKey = $this->validateSecretKey(secretKey: $secretKey);
        $this->httpClient = new Client();
    }

    private function validateSecretKey(string $secretKey): string
    {
        if (empty($secretKey) || strlen(string: $secretKey) < 10) {
            throw new InvalidArgumentException(message: "Invalid reCAPTCHA secret key");
        }
        return $secretKey;
    }

    # Actual verifying happens here
    public function verify(string $recaptchaResponse): bool
    {
        if (empty($recaptchaResponse)) {
            return false;
        }

        try {
            # query for siteverify with secret key
            $verifyResponse = $this->httpClient->post(uri: $this->verifyUrl, options: [
                "form_params" => [
                    "secret" => $this->secretKey,
                    "response" => $recaptchaResponse
                ]
            ]);

            $responseBody = json_decode(json: $verifyResponse->getBody()->getContents(), associative: false);
            return $responseBody->success ?? false;
        } catch (Exception $e) {
            error_log(message: "reCAPTCHA verification failed: " . $e->getMessage());
            return false;
        }
    }

    public function handleSubmission(array $formData): bool
    {
        if (!isset($formData[$this->buttonName])) {
            return false;
        }

        $recaptchaResponse = $formData["g-recaptcha-response"] ?? "";
        return $this->verify(recaptchaResponse: $recaptchaResponse);
    }
}

class FormProcessor
{
    private CaptchaVerifier $captchaVerifier;

    public function __construct()
    {
        $dotenv = Dotenv::createImmutable(paths: __DIR__ . "/../../");
        $dotenv->load();
        # Load secret key from environment variable
        $secret_key = $_ENV["RECAPTCHA_SECRET"];
        try {
            if (!isset($secret_key)) {
                throw new InvalidArgumentException(message: "RECAPTCHA_SECRET_KEY is not set in the environment.");
            } else {
                $this->captchaVerifier = new CaptchaVerifier(secretKey: $_ENV["RECAPTCHA_SECRET"]);
            }
        } catch (Exception $error) {
            throw new Exception(message: "Unable to verify captcha: " . $error->getMessage());
        }
    }

    private function rateLimitCheck(string $key, int $limit, int $period): bool
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
            return true;
        }

        $data = [];
        if (file_exists(filename: $filename)) {
            $data = json_decode(json: file_get_contents(filename: $filename), associative: true);
        }

        $current_time = time();

        if (isset($data[$ip]) && $current_time - $data[$ip]["last_access_time"] >= $period) {
            $data[$ip]["count"] = 0;
            $data[$ip]["last_access_time"] = $current_time;
        }

        if (isset($data[$ip]) && $data[$ip]["count"] >= $limit) {
            return true;
        }

        if (!isset($data[$ip])) {
            $data[$ip] = ["count" => 0, "last_access_time" => $current_time];
        }

        $data[$ip]["count"]++;
        file_put_contents(filename: $filename, data: json_encode(value: $data));
        return false;
    }

    public function processForm(): void
    {
        header(header: "Content-Type: application/json");

        # Validate form submission via posting through a form element
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            http_response_code(response_code: 405);
            echo json_encode(value: [
                "success" => false,
                "message" => "Method Not Allowed"
            ]);
            exit;
        }

        # Validate form submission from front-end
        if (!isset($_POST["captcha_submit"])) {
            http_response_code(response_code: 400);
            echo json_encode(value: [
                "success" => false,
                "message" => "Invalid submission"
            ]);
            exit;
        }

        if ($this->rateLimitCheck(key: "recaptcha_verify", limit: 5, period: 60)) {
            http_response_code(response_code: 401);
            echo json_encode(value: [
                "success" => false,
                "message" => "Rate limit exceeded. Please try again later."
            ]);
            exit;
        }

        $verificationResult = $this->captchaVerifier->handleSubmission(formData: $_POST);
        if ($verificationResult) {
            echo json_encode(value: [
                "success" => true,
                "message" => "Captcha verified successfully",
                "nextAction" => "proceed"
            ]);
        } else {
            http_response_code(response_code: 401);
            echo json_encode(value: [
                "success" => false,
                "message" => "Captcha verification failed",
                "action" => "retry"
            ]);
        }
        exit;
    }
}

$form = new FormProcessor();
$form->processForm();