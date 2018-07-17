<div class="reg-as">
    Logged in as: <b><?php print($_SESSION['user']['name']) ?></b>
</div>
<form action="login_eval.php" method="post">
    <input class="login-button" name="SUB" type="submit" value="LOGOUT">
    <div class="vl"></div>
    <?php
    if ($_SERVER['PHP_SELF'] === "/WebProject1/profile.php") {
        echo "<input class=\"login-button\" name=\"SUB\" type=\"submit\" value=\"MAIN\" formaction=\"index.php\">";
    } else {
        echo "<input class=\"login-button\" name=\"SUB\" type=\"submit\" value=\"EDIT\" formaction=\"profile.php\">";
    }
    ?>
</form>