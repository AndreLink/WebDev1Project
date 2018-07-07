<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css"></head>
<body>
<?php
include "login_manager.php";
if (isset($_POST['points'])) {
    echo "points: " . $_POST['points'] . " ";
}
if (isset($_POST['kills'])) {
    echo "kills: " . $_POST['kills'];
}
if (checkSession('login', true)) {
    addGameResult($_SESSION['user']['name'], $_POST['points'], $_POST['kills']);
}
include "play_button.php";
include "error_bar.php";
?>
</body>
</html>