<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" http-equiv="Refresh" content="0; url=index.php">
    <title>Edit</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>
<?php
include "functions.php";

$accounts = load_accounts();

$edit = true;
if (isset($_POST['USR']) &&
    isset($_POST['EML']) &&
    isset($_POST['PWD']) &&
    isset($_POST['PWW']) &&
    $_POST['PWD'] === $_POST['PWW']) {

    $old_name = $_SESSION['user']['name'];
    $temp = update_accounts($_SESSION['user']['id'], $_POST['USR'], $_POST['PWD'], $_POST['EML']);
    if($temp === 1) {
        update_games($old_name, $_POST['USR']);
        $_SESSION['ERROR'] = 'Account wurde erfolgreich angepasst';
    } else if ($temp === -1) {
        $_SESSION['ERROR'] = 'Neuer Name existiert bereits';
    }
} else {
    $_SESSION['ERROR'] = 'Fehler beim Editieren';
}
?>
<p>
    <a href="index.php">Zurück</a>
</p>
</body>
</html>