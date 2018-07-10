<div>
    Angemeldet als: <?php print($_SESSION['user']['name']) ?>
    <form action="login_eval.php" method="post">
        <input class="button" name="SUB" type="submit" value="LOGOUT">
        <?php
            if ($_SERVER['PHP_SELF'] === "/WebProject1/profile.php") {
                echo "<input class=\"button\" name=\"SUB\" type=\"submit\" value=\"MAIN\" formaction=\"home.php\">";
            } else {
                echo "<input class=\"button\" name=\"SUB\" type=\"submit\" value=\"EDIT\" formaction=\"profile.php\">";
            }
        ?>
    </form>
</div>