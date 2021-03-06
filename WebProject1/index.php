<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Home</title>
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
                <canvas id="gameCanvas"
                        height="512"
                        width="1024"
                        onmousedown="launch()"
                ></canvas>
                <div class="hover_img">
                    <a href="how_to_play.php">How to play</a>
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

<script>drawSoap();</script>
<form id="game_data" action="game_over.php" method="post">
    <input type="hidden" name="time" id="time" />
    <input type="hidden" name="kills" id="kills" />
    <input type="hidden" name="game_id" id="game_id" />
</form>
</body>
</html>