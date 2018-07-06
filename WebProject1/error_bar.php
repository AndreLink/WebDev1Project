<div class="error_bar">
    <?php
    if (!isset($_SESSION['ERROR'])) {
        $_SESSION['ERROR'] = '';
    }
    echo($_SESSION['ERROR']);
    $_SESSION['ERROR'] = '';
    ?>
</div>
