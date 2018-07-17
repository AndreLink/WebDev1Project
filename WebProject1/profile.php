<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Profile</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>

<div class="main-page">
    <div class="main-top">
        <?php include "login_manager.php"; ?>
    </div>
    <div class="main-mid">
        <div class="mid-center">
            <div class="mid-center-content">
                <?php include "edit_account.php"; ?>
            </div>
        </div>
        <div class="mid-right">
                <table>
                    <tr>
                        <th colspan="2"><h1>Latest Games</h1></th>
                    </tr>
                    <tr>
                        <th>Time</th>
                        <th>Kills</th>
                    </tr>
                    <?php
                    $max_entries = 50;
                    $games = create_player_games($_SESSION['user']['name']);
                    $size = count($games);
                    for ($i = 0; $i < $max_entries; $i++) {
                        if ($i<$size) {
                            echo "<tr><td>" . $games[$i]['time'] * 0.001 . "s" . "</td><td>" . $games[$i]['kills'] . "</td></tr>";
                        } else {
                            echo "<tr><td> -- </td><td> -- </td></tr>";
                        }
                    }
                    ?>
                </table>
        </div>
    </div>
    <div class="main-bot">
        <?php include "error_bar.php"; ?>
    </div>
</div>
</body>
</html>