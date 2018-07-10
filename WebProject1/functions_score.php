<?php

function load_games()
{
    // file name
    $file = "games.txt";

    // create game array
    $games = array();
    $file_handle = fopen($file, "r");
    $size = 0;
    while ($line = fgets($file_handle)) {
        $game = explode("@@@", $line);
        $games[$size]['id'] = $game[0];
        $games[$size]['name'] = $game[1];
        $games[$size]['time'] = $game[2];
        $games[$size]['kills'] = $game[3];
        $size++;
    }
    fclose($file_handle);

    // return result
    return $games;
}

function save_games($games)
{
    // file path
    $file = "games.txt";

    // write account array into file
    $entry = "";
    foreach ($games as $game) {
        $entry = $entry . trim($game['id'] . "@@@" . $game['name'] . "@@@" . $game['time'] . "@@@" . $game['kills']) . "\n";
    }
    file_put_contents($file, $entry);
}


function add_game_results($id, $name, $time, $kills)
{
    // file name
    $file = "games.txt";

    // check if game was already added
    $games = load_games();
    foreach ($games as $game) {
        if ($game['id'] === $id) {
            // return failure
            return -1;
        }
    }

    // add game to file
    $file_handle = fopen($file, "a");
    $entry = trim($id . "@@@" . $name . "@@@" . $time . "@@@" . $kills) . "\n";
    fputs($file_handle, $entry);
    fclose($file_handle);

    // return success
    return 1;
}

function update_games($old_name, $new_name)
{
    // read games file into array
    $games = load_games();

    // update games with new name
    foreach ($games as &$game) {
        if ($game['name'] === $old_name) {
            $game['name'] = $new_name;
        }
    }

    // write account array into file
    save_games($games);

    // return success
    return 1;
}

function create_sorted_game_list()
{
    // get unsorted game list
    $games = load_games();

    // sort games
    usort($games, function($a, $b) {
        return $a['time'] <=> $b['time'];
    });

    // return result
    return $games;
}

function create_player_games($player_name)
{
    // get full game list
    $games = load_games();

    // filter for games by $player_name
    $games_player = array();
    foreach ($games as $game) {
        if ($game['name'] === $player_name) {
            $games_player[] = $game;
        }
    }

    // return results
    return $games_player;
}