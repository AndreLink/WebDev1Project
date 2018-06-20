    <table id="login">
        <tr>
            <td>Angemeldet als:</td>
            <td><?php print($_SESSION['user']['name'])?></td>
        </tr>
        <tr>
            <td>
                <form action="login_eval.php" method="post">
                    <input class="button" name="SUB" type="submit" value="LOGOUT">
                </form>
            </td>
            <td>
                <form action="play.php" method="post">
                    <input class="button" name="SUB" type="submit" value="PLAY">
                </form>
            </td>
        </tr>
    </table>