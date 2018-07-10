<div class="score_flex">
    <div class="score_box">
        <table>
            <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Time</th>
            <th>Kills</th>
            </tr>
            <?php
            $max_entries = 20;
            $games = create_sorted_game_list();
            $size = count($games);
            for ($i = 0; $i < $max_entries; $i++) {
                if ($i<$size) {
                    echo "<tr><td>" . ($i + 1) . "</td><td>" . $games[$i]['name'] . "</td><td>" . $games[$i]['time']*0.001 . "s </td><td>" . $games[$i]['kills'] . "</td></tr>";
                } else {
                    echo "<tr><td>" . ($i + 1) . "</td><td> -- </td><td> -- </td><td> -- </td></tr>";
                }
            }
            ?>
        </table>
    </div>
</div>