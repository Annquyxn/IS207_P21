<?php
require_once 'vendor/autoload.php';

$fb = new \Facebook\Facebook([
  'app_id' => 'YOUR_APP_ID',
  'app_secret' => 'YOUR_APP_SECRET',
  'default_graph_version' => 'v18.0',
]);

$helper = $fb->getRedirectLoginHelper();
$permissions = ['email']; // quyền cần lấy

$callbackUrl = htmlspecialchars('http://localhost/your_project/fb-callback.php');
$loginUrl = $helper->getLoginUrl($callbackUrl, $permissions);

header("Location: $loginUrl");
exit();
