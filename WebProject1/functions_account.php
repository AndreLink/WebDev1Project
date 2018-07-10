<?php

function load_accounts()
{
    // file name
    $file = "accounts.txt";

    // create account array
    $accounts = array();
    $file_handle = fopen($file, "r");
    $size = 0;
    while ($line = fgets($file_handle)) {
        $account = explode("@@@", $line);
        $accounts[$size]['id'] = $account[0];
        $accounts[$size]['name'] = $account[1];
        $accounts[$size]['pwd'] = $account[2];
        $accounts[$size]['email'] = $account[3];
        $size++;
    }
    fclose($file_handle);

    // return result
    return $accounts;
}

function save_accounts($accounts)
{
    // file path
    $file = "accounts.txt";

    // write account array into file
    $entry = "";
    foreach ($accounts as $account) {
        $entry = trim($entry .  $account['id'] . "@@@" . $account['name'] . "@@@" . $account['pwd'] . "@@@" . $account['email']) . "\n";
    }
    file_put_contents($file, $entry);
}


function add_new_account($name, $password, $email)
{
    // file name
    $file = "accounts.txt";

    // check already existing accounts for same name
    $accounts = load_accounts();
    foreach ($accounts as $account) {
        if ($account['name'] === $name) {
            // return failure
            return -1;
        }
    }

    // create id
    $id = rand()%10000;

    // add account to file
    $file_handle = fopen($file, "a");
    $entry = trim($id . "@@@" . $name . "@@@" . $password . "@@@" . $email) . "\n";
    fputs($file_handle, $entry);
    fclose($file_handle);

    // return success
    return 1;
}

function update_accounts($id, $name, $password, $email)
{
    // read account file into array
    $accounts = load_accounts();

    // check if anything changed
    if ($_SESSION['user']['name'] === $name &&
        $_SESSION['user']['pwd'] === $password &&
        $_SESSION['user']['email'] === $email ) {
        return -2;
    }

    // check already existing accounts for same name
    foreach ($accounts as $account) {
        if ($account['id'] !== $id && $account['name'] === $name) {
            // return failure
            return -1;
        }
    }

    // update account array with new information
    foreach ($accounts as &$account) {
        if ($account['id'] === $id) {
            $account['name'] = $name;
            $account['pwd'] = $password;
            $account['email'] = $email;
            $_SESSION['user'] = $account;
        }
    }

    // write account array into file
    save_accounts($accounts);

    // return success
    return 1;
}