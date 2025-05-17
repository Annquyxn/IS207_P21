<?php
session_start();
header('Content-Type: application/json');

// Cho phép React frontend (nếu khác domain) gọi được (bạn có thể tùy chỉnh domain cụ thể)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Kết nối DB
include 'connect.php';

// Hàm sanitize input
function sanitize_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Kiểm tra xem người dùng đã đăng nhập chưa
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Đã đăng nhập rồi',
        'username' => $_SESSION['username'],
        'userId' => $_SESSION['user_id']
    ]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Phương thức không hợp lệ']);
    exit();
}

// Lấy dữ liệu POST dạng JSON (React thường gửi JSON)
$data = json_decode(file_get_contents('php://input'), true);

$login_id = isset($data['login_id']) ? sanitize_input($data['login_id']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if ($login_id === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Vui lòng nhập đầy đủ thông tin!']);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ? OR phone = ?");
$stmt->bind_param("ss", $login_id, $login_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 1) {
    $row = $res->fetch_assoc();
    if (password_verify($password, $row['pass'])) {
        // Đăng nhập thành công, lưu session
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];

        echo json_encode([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'username' => $row['username'],
            'userId' => $row['id']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Sai mật khẩu!']);
    }
} elseif ($res->num_rows > 1) {
    echo json_encode(['success' => false, 'message' => 'Có nhiều tài khoản trùng nhau!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy tài khoản!']);
}

$stmt->close();
$conn->close();
?>
