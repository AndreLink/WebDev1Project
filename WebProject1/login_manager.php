<form class="login_manager_flex" action="login_eval.php" method="post">
     <?php
        include "functions.php";
        if (checkSession('login', true)) {
            include "logged_in_as_form.php";
        } else {
            include "login_form.html";
        }
        ?>
</form>