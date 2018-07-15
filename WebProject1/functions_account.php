<?php
function login($usr, $pwd)
{
    $accounts = load_accounts();
    $login_fail = true;
    foreach ($accounts as $account) {
        if ($usr === $account['name'] && password_verify($pwd, $account['pwd'])) {
            $_SESSION['login'] = true;
            $_SESSION['user'] = $account;
            $_SESSION['ERROR'] = 'Login erfolgreich';
            $login_fail = false;
        }
    }
    if ($login_fail) {
        $_SESSION['ERROR'] = 'Falscher Benutzername oder falsches Kennwort';
    }
}

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

    if(ctype_alnum($name) === false) {
        return -2;
    }

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

    // hash password
    $pw_hash = password_hash($password, PASSWORD_DEFAULT);

    // add account to file
    $file_handle = fopen($file, "a");
    $entry = trim($id . "@@@" . $name . "@@@" . $pw_hash . "@@@" . $email) . "\n";
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
        password_verify($password, $_SESSION['user']['pwd']) &&
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
            $account['pwd'] = password_hash($password, PASSWORD_DEFAULT);
            $account['email'] = $email;
            $_SESSION['user'] = $account;
        }
    }

    // write account array into file
    save_accounts($accounts);

    // return success
    return 1;
}