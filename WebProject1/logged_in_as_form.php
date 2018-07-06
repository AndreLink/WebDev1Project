<div>
    Angemeldet als: <?php print($_SESSION['user']['name']) ?>
    <form action="login_eval.php" method="post">
        <input class="button" name="SUB" type="submit" value="LOGOUT">
        <input class="button" name="SUB" type="submit" value="EDIT" formaction="edit_account.php">
    </form>
</div>