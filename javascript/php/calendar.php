<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

$params = $_SERVER['REQUEST_METHOD'] === 'GET' ? json_decode($_GET['x'], false) : json_decode($_POST['x'], false);

$calendarData = [];

function readData($start_d, $end_d) {
	global $calendarData;
	
	$handle = fopen("db/calendar.txt", "r");
	if ($handle) {
		
		list ($sm1, $sd1, $sy1) = explode("/", $start_d);
		list ($em1, $ed1, $ey1) = explode("/", $end_d);
		
		while (($line = fgets($handle)) !== false) {
			$line = rtrim($line);
			if ($line !== "") {
				list ($id, $username, $startdate, $enddate, $type, $text) = explode(";", $line);
				list ($sm2, $sd2, $sy2) = explode("/", $startdate);
				list ($em2, $ed2, $ey2) = explode("/", $enddate);

				if ($sy1 == $sy2 && $ey1 == $ey2) {
					if ($sm2 >= $sm1 && $em2 <= $em1) {
						$one = [
							"id" => $id, 
							"username" => $username, 
							"startdate" => $startdate, 
							"enddate" => $enddate, 
							"type" => $type,
							"text" => $text
						]; 
						array_push($calendarData, $one);
					}
				}
				elseif ($sd2 >= $sd1 && $ey2 <= $ey1) {
					$one = [
						"id" => $id, 
						"username" => $username, 
						"startdate" => $startdate, 
						"enddate" => $enddate, 
						"type" => $type,
						"text" => $text
					]; 
					array_push($calendarData, $one);
				}
			}
		}
		fclose($handle);
	} 
}

function writeData($args, $delete) {
	global $calendarData;		
	
	$handle = fopen("db/calendar.txt", "r");
	if ($handle) {
		while (($line = fgets($handle)) !== false) {
			$line = rtrim($line);
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
	
	if ($delete) {
		unset($calendarData[$args->id]);
	}
	else {
		$one = [
			"id" => $args->id,
			"username" => $args->username,
			"startdate" => $args->startdate, 
			"enddate" => $args->enddate, 
			"type" => $args->type,
			"text" => $args->text
		]; 

		$calendarData[$args->id] = $one;
	}

	try {
		$myfile = fopen("db/calendar.txt", "w") or die("Unable to open file!");
		foreach ($calendarData as &$one) {
			fwrite($myfile, 
				$one["id"] . ";" . 
				$one["username"] . ";" . 
				$one["startdate"] . ";" . 
				$one["enddate"] . ";" . 
				$one["type"] . ";" . 
				$one["text"] . PHP_EOL
			);
		}
		fclose($myfile);
		
	} 
	catch(Exception $e) {
		echo "Message: " . $e->getMessage() . "\n";
	}
}

switch($params->func) {
	case 'read':
		readData($params->startdate, $params->enddate);
		$result = [
			"responseText" => "Read completed.", 
			"data" => $calendarData
		];
		echo json_encode($result);
	break;

	case 'write':
		writeData($params, false);
		$result = [
			"responseText" => "Write completed.", 
			"data" => []
		];
		echo json_encode($result);
	break;
	
	case 'delete':
		writeData($params, true);
		$result = [
			"responseText" => "Delete completed.", 
			"data" => []
		];
		echo json_encode($result);
	break;
	
	default: break;
}

?>
