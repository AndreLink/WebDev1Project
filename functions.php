<?php
/**
 * Created by PhpStorm.
 * User: Andre
 * Date: 19.06.2018
 * Time: 21:27
 */
function checkPost($key, $value) {
    return (isset($_POST[$key]) && $_POST[$key] === $value);
}

function checkSession($key, $value) {
    return (isset($_SESSION[$key]) && $_SESSION[$key] === $value);
}

function readAccounts() {
    $accounts = array();
    $file = "accounts.txt";
    $fhandle = fopen($file, "r");
    $int = 0;
    while ($line = fgets($fhandle))
    {
        $account = explode("@@@", $line);
        $accounts[$int]['name'] = $account[0];
        $accounts[$int]['pwd'] = $account[1];
        $accounts[$int]['email'] = $account[2];
        $int = $int + 1;
    }
    fclose($fhandle);
    return $accounts;
}

function addNewAccount($name, $passwort, $email) {
    $file = "accounts.txt";
    $fhandle = fopen($file, "a");
    $entry = "\n" . $name . "@@@" . $passwort . "@@@" . $email;
    fputs($fhandle, $entry);
    fclose($fhandle);
}