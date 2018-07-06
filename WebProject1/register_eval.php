<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" http-equiv="Refresh" content="0; url=home.php">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>
<?php
include "functions.php";
session_start();

// liest accounts aus accounts.txt ein
$accounts = readAccounts();

$register = true;
if (isset($_POST['USR']) &&
    isset($_POST['EML']) &&
    isset($_POST['PWD']) &&
    isset($_POST['PWW']) &&
    $_POST['PWD'] === $_POST['PWW']) {
    foreach ($accounts as $account) {
        if (checkPost('USR', $account['name']) && checkPost('PWD', $account['pwd'])) {
            $_SESSION['ERROR'] = 'Account existiert bereits';
            $register = false;
        }
    }
    if ($register) {
        addNewAccount($_POST['USR'], $_POST['PWD'], $_POST['EML']);
        $_SESSION['ERROR'] = 'Account erfolgreich angelegt!';
    }
} else {
    $_SESSION['ERROR'] = 'Fehler bei der Accounterstellung';
}
?>
<p>
    <a href="home.php">Zurück</a>
</p>
</body>
</html>