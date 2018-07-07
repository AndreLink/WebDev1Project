<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>
<?php include "login_manager.php"; ?>
<div class="main_window_flex">
    <div class="left_main">
        <?php
        include "title.php";
        include "play_button.php";
        ?>
    </div>
    <div class="right_main">
        <?php include "scoreboard.php"; ?>
    </div>

</div>
<?php include "error_bar.php"; ?>
</body>
</html>