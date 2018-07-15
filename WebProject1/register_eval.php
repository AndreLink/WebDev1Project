<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" http-equiv="Refresh" content="0; url=index.php">
    <title>Register</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>
<?php
include "functions.php";

if (isset($_POST['USR']) &&
    isset($_POST['EML']) &&
    isset($_POST['PWD']) &&
    isset($_POST['PWW']) &&
    $_POST['PWD'] === $_POST['PWW']) {
    if (add_new_account($_POST['USR'], $_POST['PWD'], $_POST['EML']) === 1) {
        $_SESSION['login'] = true;
        login($_POST['USR'], $_POST['PWD']);
        $_SESSION['ERROR'] = 'Account erfolgreich angelegt!';
    } else {
        $_SESSION['ERROR'] = 'Fehler bei der Accounterstellung';
    }
}
?>
<p>
    <a href="index.php">Zurück</a>
</p>
</body>
</html>