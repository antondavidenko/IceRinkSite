<?php
session_start();
$isLogged = $_SESSION['isLogged'];
$params = $_POST;
$file_name = (string) $params['file_name'];
$file_data = (string) $params['file_data'];

// errorId : 0 = all is ok
// errorId : 1 = not loggin
// errorId : 2 = not filename or\and data in params

if (!$isLogged) {
	echo json_encode(['errorId'=>'1']);
} else
if (isset($params['file_name'])&&isset($params['file_data'])) {
	$savefile = fopen($file_name, "w") or die("Unable to open file!");
	fwrite($savefile, $file_data);
	fclose($savefile);
	echo json_encode(['errorId'=>'0']);
} else {
	echo json_encode(['errorId'=>'2']);
}
?>