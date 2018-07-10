<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css">
    <script src="game.js"></script>
</head>
<body>
<?php include "login_manager.php"; ?>
<div class="main_window_flex">
    <div class="left_main">
        <canvas id="gameCanvas"
                height="512"
                width="1024"
                style="border:1px solid #333333;"
                onmousedown="launch()"
        ></canvas>
    </div>
    <div class="right_main">
        <?php include "scoreboard.php"; ?>
    </div>

</div>
<?php include "error_bar.php"; ?>
<script>drawSoap();</script>
<form id="game_data" action="game_over.php" method="post">
    <input type="hidden" name="time" id="time" />
    <input type="hidden" name="kills" id="kills" />
    <input type="hidden" name="game_id" id="game_id" />
</form>
</body>
</html>