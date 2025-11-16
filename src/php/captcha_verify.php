<?php
namespace App\Security;

use Dotenv\Dotenv;
use GuzzleHttp\Client;
use InvalidArgumentException;

class CaptchaVerifier
{
    private string $buttonName;
    private string $secretKey;
    private Client $httpClient;

    public function __construct(string $secretKey, string $buttonName = "captcha_submit_btn")
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
            $verifyResponse = $this->httpClient->get(uri: "https://www.google.com/recaptcha/api/siteverify", options: [
                "query" => [
                    "secret" => $this->secretKey,
                    "response" => $recaptchaResponse
                ]
            ]);

            $responseBody = json_decode(json: $verifyResponse->getBody()->getContents(), associative: false);
            return $responseBody->success ?? false;
        } catch (\Exception $e) {
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
        $dotenv = Dotenv::createImmutable(paths: __DIR__);
        $dotenv->load();
        # Load secret key from environment variable
        $this->captchaVerifier = new CaptchaVerifier(secretKey: $_ENV["RECAPTCHA_SECRET_KEY"]);
    }

    public function processForm(): void
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $verificationResult = $this->captchaVerifier->handleSubmission(formData: $_POST);

            if ($verificationResult) {
                echo json_encode(value: ["success" => true, "message" => "Captcha verified successfully"]);
            } else {
                echo json_encode(value: ["success" => false, "message" => "Captcha verification failed"]);
            }
        }
    }
}