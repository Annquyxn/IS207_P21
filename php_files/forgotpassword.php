<?php
// Cho phép frontend React gửi request
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Supabase config
$SUPABASE_URL = 'https://yqbaaipksxorhlynhmfd.supabase.co';
$SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Dùng anon key

// Nhận email từ POST
$body = json_decode(file_get_contents('php://input'), true);
$email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Email không hợp lệ']);
    exit;
}

// Gửi yêu cầu khôi phục mật khẩu tới Supabase Auth
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "$SUPABASE_URL/auth/v1/recover");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $SUPABASE_KEY",
    "Content-Type: application/json"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => $email
]));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Lỗi cURL: ' . curl_error($ch)]);
} elseif ($http_code !== 200) {
    http_response_code($http_code);
    echo json_encode(['error' => "Lỗi từ Supabase (HTTP $http_code)", 'response' => $response]);
} else {
    echo json_encode(['ok' => true, 'message' => 'Email đặt lại mật khẩu đã được gửi nếu tài khoản tồn tại.']);
}

curl_close($ch);
