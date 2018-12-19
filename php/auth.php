<?php

$config = [
    'login' => 'admin',
    'password_hash' => '$2y$12$Aud5EllTFzalto6JidH4c.46CSN95bUQo3QDVbaDr7cJvN3/yz4qy',
    'access_token' => '$2y$10$2lg/HUi88iAuvPS9EFKGQeUqhKC3/Zn7ORk3UNZJfaicHDfwajAk.'
];

$params = $_POST;
$cookieParams = $_COOKIE;
$isLogged = false;
session_start();

if (isset($_GET['log_off'])) {
    unset($_COOKIE['token']);
    setcookie('token', null, time() - 1, '/');
    $_SESSION['isLogged'] = false;
} else if (isset($params['login'], $params['password'])) {

    if (($params['login'] === $config['login']) && password_verify($params['password'], $config['password_hash'])) {
        $isLogged = true;
        $expireTime = time() + (60 * 60 * 24); //one day
        setcookie('token', $config['access_token'], $expireTime, '/');
        $_SESSION['isLogged'] = $isLogged;
    } else {
        //echo 'Login or Password incorrect<br><br>';
    }

} else if (isset($cookieParams['access_token'])) {

    if ($cookieParams['access_token'] === $config['access_token']) {
        $isLogged = true;
    }

}

echo json_encode(['isLogged' => $isLogged]);
?>