<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>How to Play</title>
    <link rel="stylesheet" type="text/css" href="format.css">
    <script src="game.js"></script>
</head>
<body>

<div class="main-page">
    <div class="main-top">
        <?php include "login_manager.php"; ?>
    </div>
    <div class="main-mid">
        <div class="mid-center">
            <div class="mid-center-content">
                <img src="game_tutorial_transparent.png" alt="How to play" height="512">
                <div class="hover_img">
                    <a href="index.php">Back</a>
                </div>
            </div>
        </div>
        <div class="mid-right">
            <?php include "scoreboard.php"; ?>
        </div>
    </div>
    <div class="main-bot">
        <?php include "error_bar.php"; ?>
    </div>
</div>

</body>
</html>