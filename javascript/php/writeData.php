<?php

header('Access-Control-Allow-Origin: *');

/*
foreach ($_GET as $item) {
    echo $item . "\n";
}
*/
$calendarData = [];

if (isset($_GET['parm'])) {

	function writeArray() {
		
		global $calendarData;
		
		$parm = $_GET['parm'];
		$parm = str_replace(";", "&", $parm);
		$args = explode("|", $parm);
		
		foreach ($args as &$arg) {
			$arg = "http://www.url?" . $arg;
			$queryStr = parse_url($arg, PHP_URL_QUERY);
			//echo $queryStr ."\n";
			parse_str($queryStr, $queryParams);
			array_push($calendarData, $queryParams);
		}
	}
	
	writeArray();
}

if (
	isset($_GET['id']) && 
	isset($_GET['username']) && 
	isset($_GET['startdate']) && 
	isset($_GET['enddate']) && 
	isset($_GET['type']) && 
	isset($_GET['text'])) {
	
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
					//array_push($calendarData, $one);
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
					
				//echo $one["id"] . ";" . $one["username"] . ";" . $one["startdate"] . ";" . $one["enddate"] . ";" . $one["type"] . ";" . $one["text"] . PHP_EOL;
			}
			fclose($myfile);
			echo "Write completed\n";
		} catch(Exception $e) {
			echo "Message: " . $e->getMessage() . "\n";
		}		
	}
	
	$id = $_GET['id'];
	$username = $_GET['username'];
	$startdate = $_GET['startdate'];
	$enddate = $_GET['enddate'];
	$type = $_GET['type'];
	$text = $_GET['text'];
	
	$one = [
		"id" => $id,
		"username" => $username,
		"startdate" => $startdate, 
		"enddate" => $enddate, 
		"type" => $type,
		"text" => $text
	]; 
	
	readData();
	$calendarData[$id] = $one;
	writeData();
}

?>
