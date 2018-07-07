<div class="score_flex">
    <div class="score_box">
        <table>
            <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Punkte</th>
            <th>Kills</th>
            </tr>
            <?php
            $max_entries = 20;
            $games = createScoreBoard();
            $size = count($games);
            $board_size = min($size, $max_entries);
            for ($i = 0; $i < $max_entries; $i++) {
                if ($i<$board_size) {
                    echo "<tr><td>" . ($i + 1) . "</td><td>" . $games[$i]['name'] . "</td><td>" . $games[$i]['points'] . "</td><td>" . $games[$i]['kills'] . "</td></tr>";
                } else {
                    echo "<tr><td>" . ($i + 1) . "</td><td> -- </td><td> -- </td><td> -- </td></tr>";
                }
            }
            ?>
        </table>
    </div>
</div>