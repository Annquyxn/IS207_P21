<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["username"];
$password = $data["password"];

$apiUrl = "https://yqbaaipksxorhlynhmfd.supabase.co/auth/v1/token?grant_type=password";
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmFhaXBrc3hvcmhseW5obWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDA3NDAsImV4cCI6MjA2MzExNjc0MH0.W7bgKUJmSuMS9YcmQlLK8Ol1ZOSeRcaHICECY6HWk1k";

$payload = json_encode([
  "email" => $email,
  "password" => $password
]);

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "apikey: $apiKey",
  "Authorization: Bearer $apiKey"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
  echo $response;
} else {
  http_response_code($httpCode);
  echo $response; // Trả về lỗi chi tiết từ Supabase
}
