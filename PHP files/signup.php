<?php
include 'connect.php';

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form và làm sạch
    $username = test_input($_POST["username"]);
    $password = test_input($_POST["password"]);
    $email = test_input($_POST["email"]);
    $age = test_input($_POST["age"]);

    // Kiểm tra xem username đã tồn tại chưa
    $check_sql = "SELECT * FROM user_data WHERE username = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $check_result = $stmt->get_result();

    if ($check_result->num_rows > 0) {
        echo "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.";
    } else {
        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        
        $insert_sql = "INSERT INTO user_data (username, password, email, age) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insert_sql);
        $stmt->bind_param("sssi", $username, $hashed_password, $email, $age);

        if ($stmt->execute()) {
            echo "Tạo tài khoản thành công!";
        } else {
            echo "Lỗi khi tạo tài khoản: " . $conn->error;
        }
    }

    // Đóng kết nối
    $stmt->close();
    $conn->close();
}
?>
