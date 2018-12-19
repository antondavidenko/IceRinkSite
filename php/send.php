<?php
$file_name = "./../content/inbox.js";

$inboxfile = fopen($file_name, "a+") or die("Unable to open file!");

$message = new stdClass();
$message->name = urldecode ($_POST["name"]);
$message->email = urldecode ($_POST["email"]);
$message->message = urldecode ($_POST["message"]);
$message->date = date('l jS \of F Y h:i:s A');

//$txt = "Name:".$name."\nEmail:".$email."\nMessage:".$message."\nDate:".date('l jS \of F Y h:i:s A')."\n\n";
//fwrite($inboxfile, $txt);

$contents = (string)fread($inboxfile, filesize($file_name));
$contents = substr($contents,0,strlen($contents)-1);
$newdata = $contents.",".json_encode($message)."]";
fclose($inboxfile);

$inboxfile = fopen($file_name, "w") or die("Unable to open file!");
fwrite($inboxfile, $newdata);
fclose($inboxfile);
echo json_encode(['errorId'=>'0']);
?>