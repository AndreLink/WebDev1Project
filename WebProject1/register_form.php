<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" type="text/css" href="format.css">
</head>
<body>
<div class="register_flex">
    <div class="register_box">
        <form action="register_eval.php" method="post">
            <table>
                <tr>
                    <td>Benutzername</td>
                    <td><input name="USR" type="text" size="15" maxlength="100" required="required"></td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><input name="EML" type="email" size="15" maxlength="100" required="required"></td>
                </tr>
                <tr>
                    <td>Passwort</td>
                    <td><input name="PWD" type="password" size="15" maxlength="100" required="required"></td>
                </tr>
                <tr>
                    <td>Passwort wiederholen</td>
                    <td><input name="PWW" type="password" size="15" maxlength="100" required="required"></td>
                </tr>
                <tr>
                    <td><input class="button" name="SUB" type="submit" value="REGISTER"></td>
                </tr>
            </table>
        </form>
    </div>
</div>
</body>
</html>