<?php

header('Access-Control-Allow-Origin: *');

$calendarData = [];

if (isset($_GET['startdate']) && isset($_GET['enddate'])) {

	function readData($start_d, $end_d) {
		global $calendarData;
		
		$handle = fopen("db/calendar.txt", "r");
		if ($handle) {
			
			list ($sm1, $sd1, $sy1) = explode("/", $start_d);
			list ($em1, $ed1, $ey1) = explode("/", $end_d);
			
			while (($line = fgets($handle)) !== false) {
				$line = trim($line, " \t\n\r\0\x0B");
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
					elseif ($sr2 >= $sr1 && $ey2 <= $ey1) {
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
			echo "[BEG]";
			foreach ($calendarData as &$one) {
				echo $one["id"] . ";" . $one["username"] . ";" . $one["startdate"] . ";" . $one["enddate"] . ";" . $one["type"] . ";" . $one["text"] . "|";
			}
			echo "[END]";
		} 
	}

	$startdate = $_GET['startdate'];
	$enddate = $_GET['enddate'];

	readData($startdate, $enddate);
}

?>
