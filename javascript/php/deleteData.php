<?php

header('Access-Control-Allow-Origin: *');

$calendarData = [];

if (isset($_GET['id'])) {

	function readData() {
		global $calendarData;
		
		$handle = fopen("db/calendar.txt", "r");
		if ($handle) {
			while (($line = fgets($handle)) !== false) {
				$line = trim($line, " \t\n\r\0\x0B");
				if ($line !== "") {
					list ($id, $username, $startdate, $enddate, $type, $text) = explode(";", $line);
					$one = [
						"id" => $id, 
						"username" => $username, 
						"startdate" => $startdate, 
						"enddate" => $enddate, 
						"type" => $type,
						"text" => $text
					]; 
					$calendarData[$id] = $one;
				}
			}
			fclose($handle);
		} 
	}
	
	function writeData() {
		global $calendarData;
			
		try {
			$myfile = fopen("db/calendar.txt", "w") or die("Unable to open file!");
			foreach ($calendarData as &$one) {
				fwrite($myfile, 
					$one["id"] . ";" . 
					$one["username"] . ";" . 
					$one["startdate"] . ";" . 
					$one["enddate"] . ";" . 
					$one["type"] . ";" . 
					$one["text"] . PHP_EOL);
			}
			fclose($myfile);
			echo "Delete completed\n";
		} catch(Exception $e) {
			echo "Message: " . $e->getMessage() . "\n";
		}		
	}
	
	$id = $_GET['id'];
	
	readData();
	unset($calendarData[$id]);
	writeData();
}

?>
