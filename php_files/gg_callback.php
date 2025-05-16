<?php
require_once 'vendor/autoload.php';

$client = new Google_Client();
$client->setClientId('YOUR_GOOGLE_CLIENT_ID');
$client->setClientSecret('YOUR_GOOGLE_CLIENT_SECRET');
$client->setRedirectUri('http://localhost/your_project/google-callback.php');

$client->addScope("email");
$client->addScope("profile");

if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token);

    // Lấy thông tin user
    $oauth = new Google_Service_Oauth2($client);
    $userinfo = $oauth->userinfo->get();

    session_start();
    $_SESSION['user_email'] = $userinfo->email;
    $_SESSION['user_name'] = $userinfo->name;

    header('Location: welcome.php');
    exit();
}
