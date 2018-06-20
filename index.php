<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css"></head>
<body>
<h1 id="title">Projektname</h1>
<?php
include "functions.php";
    session_start();
    if (checkSession('login', true)) {
        include "home_form.php";
    } else {
        include "login_form.html";
    }
?>
</body>
</html>