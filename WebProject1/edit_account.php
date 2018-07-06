<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css"></head>
<body>

<?php
    session_start();
?>
<div class="register_flex">
    <div class="register_box">
        <form action="edit_eval.php" method="post">
            <table id="login" class="box">
                <tr>
                    <td>Benutzername</td>
                    <td><input name="USR" type="text" size="15" maxlength="100" required="required" value=<?php echo($_SESSION['user']['name'])?>></td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><input name="EML" type="email" size="15" maxlength="100" required="required" value=<?php echo($_SESSION['user']['email'])?>></td>
                </tr>
                <tr>
                    <td>Passwort</td>
                    <td><input name="PWD" type="password" size="15" maxlength="100" required="required" value=<?php echo($_SESSION['user']['pwd'])?>></td>
                </tr>
                <tr>
                    <td>Passwort wiederholen</td>
                    <td><input name="PWW" type="password" size="15" maxlength="100" required="required" value=<?php echo($_SESSION['user']['pwd'])?>></td>
                </tr>
                <td></td>
                <td><input class="button" name="SUB" type="submit" value="Save Changes"></td>
                </tr>
            </table>
        </form>
    </div>
</div>

</body>
</html>