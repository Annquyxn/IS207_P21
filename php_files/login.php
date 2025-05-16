<?php
include 'connect.php';
// cái này để xử lý input
function sanitize_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Cái này kết nối đến cơ sở dữ liệu
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $login_id = $_POST["login_id"];
    $password = $_POST["password"];

    //print_r($_POST); 

    //tự hiểu đi em
    if ($login_id === '' || $password === '') {
        echo "<script>alert('Vui lòng nhập đầy đủ thông tin!'); window.history.back();</script>";
        exit;
    }

    // truy vấn đên cơ sở dữ liệu
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? OR phone = ?");
    $stmt->bind_param("ss", $login_id, $login_id);
    $stmt->execute();
    $res = $stmt->get_result();

    // kiểm tra xem có tài khoản nào không
    if ($res->num_rows === 1) {
        $row = $res->fetch_assoc();
    
// Kiểm tra mật khẩu
       if ($row['pass'] === $password) {
    echo "<script>alert('Đăng nhập thành công! Xin chào, " . htmlspecialchars($row['username']) . "'); window.location.href='welcome.php';</script>";
} else {
    echo "<script>alert('Sai mật khẩu!'); window.history.back();</script>";
}
    } else if ($res->num_rows > 1) {
        echo "<script>alert('Có nhiều tài khoản trùng nhau!'); window.history.back();</script>";
    } else {
        echo "<script>alert('Không tìm thấy tài khoản!'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
