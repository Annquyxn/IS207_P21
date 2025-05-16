<?php
include 'connect.php';


$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
$keyword = $conn->real_escape_string($keyword); 

$sql = "SELECT name, price FROM products WHERE name LIKE '%$keyword%'";
$result = $conn->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

header('Content-Type: application/json');
echo json_encode($products);
?>
