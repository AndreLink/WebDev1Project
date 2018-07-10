<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" http-equiv="Refresh" content="0; url=home.php">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css"></head>
<body>
<?php
include "functions.php";

if (checkPost('SUB', 'LOGIN')) {
    if(isset($_POST['USR']) && isset($_POST['PWD'])) {
        login($_POST['USR'], $_POST['PWD']);
    } else {
        $_SESSION['ERROR'] = 'Benutzername oder Passwort fehlt';
    }
} else if (checkPost('SUB', 'LOGOUT')) {
    $_SESSION['login'] = false;
    $_SESSION['ERROR'] = 'Logout erfolgreich';
}
?>
<p>
    <a href="home.php">Zurück</a>
</p>
</body>
</html>