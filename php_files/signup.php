<?php
include 'connect.php';

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = test_input($_POST["name"]);
    $email_or_phone = test_input($_POST["email"]);
    $password = test_input($_POST["password"]);
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

   
    if (filter_var($email_or_phone, FILTER_VALIDATE_EMAIL)) {
        $email = $email_or_phone;
        $phone = null;
    } elseif (preg_match('/^[0-9]{9,15}$/', $email_or_phone)) {
        $email = null;
        $phone = $email_or_phone;
    } else {
        die("");
    }

    // Kiểm tra xem email hoặc phone đã tồn tại chưa
    $check_sql = "SELECT * FROM users WHERE email = ? OR phone = ?";
    $stmt = $conn->prepare($check_sql);
    if (!$stmt) {
        die("Lỗi prepare (check): " . $conn->error);
    }

    $stmt->bind_param("ss", $email, $phone);
    $stmt->execute();
    $check_result = $stmt->get_result();

    if ($check_result->num_rows > 0) {
        echo "<script>alert('Email hoặc Số điện thoại đã được sử dụng. Vui lòng sử dụng Email hoặc số điện thoại khác'); window.history.back();</script>";
    } else {
        // Chèn dữ liệu mới vào bảng users
        $insert_sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insert_sql);
        if (!$stmt) {
            die("Lỗi prepare (insert): " . $conn->error);
        }

        $stmt->bind_param("ssss", $name, $email, $phone, $hashed_password);

        if ($stmt->execute()) {
            echo "<script>alert('Tạo tài khoản thành công!'); window.history.back();</script>";
        } else {
            echo "<script>alert('Lỗi tạo tài khoản!'); window.history.back();</script>" . $conn->error;
        }
    }

    $stmt->close();
    $conn->close();
}
?>
