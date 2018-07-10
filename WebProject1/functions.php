<?php

include "functions_account.php";
include "functions_score.php";

function checkPost($key, $value)
{
    return (isset($_POST[$key]) && $_POST[$key] === $value);
}

function checkSession($key, $value)
{
    return (isset($_SESSION[$key]) && $_SESSION[$key] === $value);
}

function login($usr, $pwd)
{
    $accounts = load_accounts();
    $login_fail = true;
    foreach ($accounts as $account) {
        if ($usr === $account['name'] && $pwd === $account['pwd']) {
            $_SESSION['login'] = true;
            $_SESSION['user'] = $account;
            $_SESSION['ERROR'] = 'Login erfolgreich';
            $login_fail = false;
        }
    }
    if ($login_fail) {
        $_SESSION['ERROR'] = 'Falscher Benutzername oder falsches Kennwort';
    }
}