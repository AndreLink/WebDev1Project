<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Game</title>
    <link rel="stylesheet" type="text/css" href="format.css">
  <script src="game.js"></script>
</head>
<body>
<?php
include "login_manager.php";
?>
<div class="game_flex">
	<canvas id="gameCanvas" 
		height="512" 
		width="1024" 
		style="border:1px solid #000000;"
		onmousedown="launch()"
		>
	</canvas>
	<p>
	WASD: move<br>
	IJKL: fire<br>
	1,2,3,4,5: change weapon<br>
	q: select previous weapon<br>
	Click the game frame to start.<br>
	</p>
</div>
</body>