<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" http-equiv="Refresh" content="0; url=home.php">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css"></head>
<body>
<?php
include "functions.php";
session_start();

// liest accounts aus accounts.txt ein
$accounts = readAccounts();

if (checkPost('SUB', 'LOGIN')) {
    $login_fail = true;
    foreach ($accounts as $account) {
        if (checkPost('USR', $account['name']) && checkPost('PWD', $account['pwd'])) {
            $_SESSION['login'] = true;
            $_SESSION['user'] = $account;
            $_SESSION['ERROR'] = 'Login erfolgreich';
            $login_fail = false;
        }
    }
    if ($login_fail) {
        $_SESSION['ERROR'] = 'Falscher Benutzername oder falsches Kennwort';
    }

} else if (checkPost('SUB', 'LOGOUT')) {
    session_destroy();
    session_start();
    $_SESSION['ERROR'] = 'Logout erfolgreich';
}
?>
<p>
    <a href="home.php">Zurück</a>
</p>
</body>
</html>