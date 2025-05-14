<?php
session_start();
require_once 'vendor/autoload.php';

$fb = new \Facebook\Facebook([
  'app_id' => 'YOUR_APP_ID',
  'app_secret' => 'YOUR_APP_SECRET',
  'default_graph_version' => 'v18.0',
]);

$helper = $fb->getRedirectLoginHelper();

try {
  $accessToken = $helper->getAccessToken();
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph error: ' . $e->getMessage();
  exit();
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'Facebook SDK error: ' . $e->getMessage();
  exit();
}

if (!isset($accessToken)) {
  echo 'Không lấy được access token';
  exit();
}

$oAuth2Client = $fb->getOAuth2Client();
$tokenMetadata = $oAuth2Client->debugToken($accessToken);
$tokenMetadata->validateAppId('YOUR_APP_ID');

try {
  $response = $fb->get('/me?fields=id,name,email', $accessToken);
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph error: ' . $e->getMessage();
  exit();
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'SDK error: ' . $e->getMessage();
  exit();
}

$user = $response->getGraphUser();

$_SESSION['user_name'] = $user['name'];
$_SESSION['user_email'] = $user['email'];

header('Location: welcome.php');
exit();
