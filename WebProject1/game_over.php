<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css"></head>
<body>
<?php include "login_manager.php"; ?>
<div class="game_over_flex">
    <img src="Game_Over1.png" alt="GAME OVER" width="700">
    <table>
        <tr>
            <td>Time Survived:</td><td><?php if (isset($_POST['time'])) { echo $_POST['time'] * 0.001 . "s"; } ?></td>
        </tr>
        <tr>
            <td>Kills:</td><td><?php if (isset($_POST['kills'])) { echo $_POST['kills']; } ?></td>
        </tr>
    </table>
    <?php
    if (checkSession('login', true)) {
        if (isset($_POST['game_id']) &&
            isset($_POST['time']) &&
            isset($_POST['kills'])) {
            if (add_game_results( $_POST['game_id'], $_SESSION['user']['name'], $_POST['time'], $_POST['kills']) == -2) {
                $_SESSION['ERROR'] = 'Nice try...';
            }
        }
    }
    ?>
    <div class="game_over_button_flex">
        <form action="index.php" method="get">
            <input class="big_button" name="SUB" type="submit" value="Back">
        </form>
    </div>
</div>
<?php include "error_bar.php"; ?>
</body>
</html>