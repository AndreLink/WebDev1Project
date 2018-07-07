<?php

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
    $size = 0;
    while ($line = fgets($fhandle))
    {
        $account = explode("@@@", $line);
        $accounts[$size]['name'] = $account[0];
        $accounts[$size]['pwd'] = $account[1];
        $accounts[$size]['email'] = $account[2];
        $size++;
    }
    fclose($fhandle);
    return $accounts;
}

function addNewAccount($name, $passwort, $email) {
    $file = "accounts.txt";
    $fhandle = fopen($file, "a");
    $entry = $name . "@@@" . $passwort . "@@@" . $email . "\n";
    fputs($fhandle, $entry);
    fclose($fhandle);
}

function addGameResult($name, $time, $kills) {
    $file = "games.txt";
    $fhandle = fopen($file, "a");
    $entry = $name . "@@@" . $time . "@@@" . $kills . "\n";
    fputs($fhandle, $entry);
    fclose($fhandle);
}

function createScoreBoard() {
    $games = array();
    $file = "games.txt";
    $fhandle = fopen($file, "r");
    $size = 0;
    while ($line = fgets($fhandle))
    {
        // skip empty lines
        if (empty($line)) {
            continue;
        }

        // create array with information about current element
        $game = explode("@@@", $line);

        // get correct position
        $pos = 0;
        while ($pos < $size && $games[$pos]['points'] > $game[1]) {
            $pos++;
        }

        // move all elements after position
        for ($i = $size; $i > $pos; $i--) {
            $games[$i] = $games[$i - 1];
        }

        // add element at position
        $games[$pos]['name'] = $game[0];
        $games[$pos]['points'] = $game[1];
        $games[$pos]['kills'] = $game[2];

        // increase size
        $size++;
    }
    fclose($fhandle);
    return $games;
}