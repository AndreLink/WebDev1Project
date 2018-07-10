<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>
<?php include "login_manager.php"; ?>
<div class="profile_flex">
    <div class="profile_info">
        <?php include "edit_account.php"; ?>
    </div>
    <div class="latest_games_box">
        <table>
            <tr>
                <th>Punkte</th>
                <th>Kills</th>
            </tr>
            <?php
            $max_entries = 20;
            $games = create_player_games($_SESSION['user']['name']);
            $size = count($games);
            for ($i = 0; $i < $max_entries; $i++) {
                if ($i<$size) {
                    echo "<tr><td>" . $games[$i]['time'] . "</td><td>" . $games[$i]['kills'] . "</td></tr>";
                } else {
                    echo "<tr><td> -- </td><td> -- </td></tr>";
                }
            }
            ?>
        </table>
    </div>
</div>
<?php include "error_bar.php"; ?>
</body>
</html>