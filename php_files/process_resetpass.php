<?php
// Kết nối database
include 'connect.php';

// Kiểm tra xem có token không
$token = $_POST['token'];
$new_password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// Tìm người dùng với token
$sql = "SELECT * FROM users WHERE reset_token = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Cập nhật mật khẩu và xóa token
    $sql_update = "UPDATE users SET pass = ?, reset_token = NULL WHERE id = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("si", $new_password, $user['id']);
    $stmt_update->execute();

    echo "Mật khẩu của bạn đã được cập nhật thành công.";
} else {
    echo "Yêu cầu không hợp lệ hoặc liên kết đã hết hạn.";
}

$conn->close();
?>
