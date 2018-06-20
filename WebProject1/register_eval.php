<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>
<div id="topBanner" class="box">
    <h1 id="title">Projektname</h1>
</div><?php
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
            print("Account existiert bereits");
            $register = false;
        }
    }
    if ($register) {
        addNewAccount($_POST['USR'], $_POST['PWD'], $_POST['EML']);
        print("Account erfolgreich angelegt!");
    }
} else {
    print("Fehler bei der Accounterstellung");
}
?>
<p>
    <a href="home.php">Zurück</a>
</p>
</body>
</html>