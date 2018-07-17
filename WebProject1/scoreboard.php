<table class="table-main">
    <tr>
        <th colspan="3"><h1>Highscores</h1></th>
    </tr>
    <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Time</th>
        <th>Kills</th>
    </tr>
    <?php
    $max_entries = 50;
    $games = create_sorted_game_list();
    $size = count($games);
    for ($i = 0; $i < $max_entries; $i++) {
        if ($i < $size) {
            echo "<tr><td>" . ($i + 1) . "</td><td>" . $games[$i]['name'] . "</td><td>" . $games[$i]['time'] * 0.001 . "s </td><td>" . $games[$i]['kills'] . "</td></tr>";
        } else {
            echo "<tr><td>" . ($i + 1) . "</td><td> -- </td><td> -- </td><td> -- </td></tr>";
        }
    }
    ?>
</table>