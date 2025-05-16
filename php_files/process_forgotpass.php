<?php
#include 'connect.php';
$email_or_username = $_POST['email_or_username'];

// Tìm kiếm người dùng theo email hoặc username
$sql = "SELECT * FROM users WHERE email = ? OR username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email_or_username, $email_or_username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $reset_token = bin2hex(random_bytes(16)); // Tạo token ngẫu nhiên

    // Lưu token vào database
    $sql_update = "UPDATE users SET reset_token = ? WHERE id = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("si", $reset_token, $user['id']);
    $stmt_update->execute();

    // Giả lập gửi email (hiển thị link thay vì gửi thực tế)
    $reset_link = "http://yourdomain.com/reset_password.php?token=$reset_token";
    echo "Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn:<br>";
    echo "<a href='$reset_link'>Đặt lại mật khẩu</a>";
} else {
    echo "Không tìm thấy tài khoản với thông tin này.";
}

$conn->close();
?>
