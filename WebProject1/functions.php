<?php

include "functions_account.php";
include "functions_score.php";

function checkPost($key, $value)
{
    return (isset($_POST[$key]) && $_POST[$key] === $value);
}

function checkSession($key, $value)
{
    return (isset($_SESSION[$key]) && $_SESSION[$key] === $value);
}