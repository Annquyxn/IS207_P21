<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Lấy dữ liệu gửi từ client
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;

// Kiểm tra đầu vào
if (!$email || !$password) {
  http_response_code(400);
  echo json_encode(["error" => "Thiếu email hoặc mật khẩu"]);
  exit;
}

// Supabase API endpoint và API key
$apiUrl = "https://yqbaaipksxorhlynhmfd.supabase.co/auth/v1/signup";
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmFhaXBrc3hvcmhseW5obWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDA3NDAsImV4cCI6MjA2MzExNjc0MH0.W7bgKUJmSuMS9YcmQlLK8Ol1ZOSeRcaHICECY6HWk1k";

// Dữ liệu gửi lên Supabase
$payload = json_encode([
  "email" => $email,
  "password" => $password
]);

// Gửi request với cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "apikey: $apiKey",
  "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

// Nhận phản hồi
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Xử lý phản hồi
if ($httpCode === 200 || $httpCode === 201) {
  echo $response;
} else {
  http_response_code($httpCode);
  echo json_encode([
    "error" => "Đăng ký thất bại",
    "details" => json_decode($response, true),
    "curl_error" => $error
  ]);
}
