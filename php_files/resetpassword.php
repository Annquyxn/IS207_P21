<?php
// ✅ Cho phép mọi domain truy cập
header("Access-Control-Allow-Origin: *");

// ✅ Cho phép các headers và phương thức
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ✅ Nếu là request OPTIONS (preflight), dừng ở đây
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Supabase config
$SUPABASE_URL = 'https://yqbaaipksxorhlynhmfd.supabase.co';
$SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmFhaXBrc3hvcmhseW5obWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDA3NDAsImV4cCI6MjA2MzExNjc0MH0.W7bgKUJmSuMS9YcmQlLK8Ol1ZOSeRcaHICECY6HWk1k';

// Nhận dữ liệu từ POST
$body = json_decode(file_get_contents('php://input'), true);
$password = $body['password'] ?? '';
$token = $body['token'] ?? '';

// Gửi yêu cầu đến Supabase Auth để đặt lại mật khẩu
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$SUPABASE_URL/auth/v1/user");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $SUPABASE_KEY",
    "Content-Type: application/json",
    "Authorization: Bearer $token"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'password' => $password
]));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Lỗi cURL: ' . curl_error($ch)]);
} elseif ($http_code >= 400) {
    http_response_code($http_code);
    echo json_encode([
        'error' => "Lỗi từ Supabase (HTTP $http_code)",
        'response' => json_decode($response, true)
    ]);
} else {
    echo json_encode([
        'ok' => true,
        'message' => 'Mật khẩu đã được đặt lại thành công'
    ]);
}

curl_close($ch); 