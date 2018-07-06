<form action="login_eval.php" method="post">
    <div class="login_manager_flex">
        <?php
        session_start();
        include "functions.php";
        if (checkSession('login', true)) {
            include "logged_in_as_form.php";
        } else {
            include "login_form.html";
        }
        ?>
    </div>
</form>