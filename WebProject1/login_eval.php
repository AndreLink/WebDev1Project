<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css"></head>
<body>
<div id="topBanner" class="box">
    <h1 id="title">Projektname</h1>
</div><?php
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
            print("Login erfolgreich");
            $login_fail = false;
        }
    }
    if ($login_fail) {
        print("Falscher Benutzername oder falsches Kennwort");
    }

} else if (checkPost('SUB', 'LOGOUT')) {
    session_destroy();
    print "Logout erfolgreich";
} else if (checkPost('SUB', 'REGISTER')) {
    include "register_form.html";
}
?>
<p>
    <a href="home.php">Zurück</a>
</p>
</body>
</html>