<?php

header('Access-Control-Allow-Origin: *');

/*
1&1 sendmail-php

<?php
$recipient = "nalizadeh@gmx.net";
$fmtResponse= implode("", file("response.htt"));
$fmtMail= implode("", file("mail.htt"));
foreach($_POST as $key=> $val) {
$fmtResponse= str_replace("<$key>", $val, $fmtResponse);
$fmtMail= str_replace("<$key>", $val, $fmtMail);
}
if ($_POST["access"] == "irregeheim") {
 mail($recipient, $_POST["subject"], $fmtMail);
}
echo $fmtResponse;
?>
*/

function sendEmailHtml($name, $email, $subject, $message) {
	$parm = '' .
		'<html><head><title>Contact form</title></head><body>' .
		'Hello, from contact form came following message:<br><br>' . 
		$name . '<br>' .
		$email . '<br>' .
		$subject . '<br>' .
		$message . '<br>' .
		'</body></html>';
					
	$recipient = 'nalizadeh@gmx.net';
	$subject = 'Kontaktformular';
	$message = $parm;
	$headers  = '' .
		'MIME-Version: 1.0' . "\r\n" .
		'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
		'From: cgi-mailer@kundenserver.de' . "\r\n" .
		'Reply-To: cgi-mailer@kundenserver.de' . "\r\n" .
		'X-Mailer: PHP/' . phpversion();

	mail($recipient, $subject, $message, $headers);
}

function sendEmailText($name, $email, $subject, $message) {
					
	$message = "Hello, from contact form came following message:\r\n\r\n" . 
		$name . "\r\n" .
		$email . "\r\n" .
		$subject . "\r\n" .
		$message . "\r\n";
	
	$recipient = 'nalizadeh@gmx.net';
	$subject = 'Kontaktformular';
	
	$header = array(
		"From: cgi-mailer@kundenserver.de",
		"Reply-To: cgi-mailer@kundenserver.de",
		"MIME-Version: 1.0",
		"Content-Type: text/plain",
		"X-Mailer: PHP/" . phpversion()
	);
		
	//mail($recipient, $subject, $message, implode("\r\n", $header));
	mail($recipient, $subject, $message);
}

function sendError($err) {
	http_response_code(404);
	echo $err;
}

if (isset($_GET['name'])) {
	if (isset($_GET['email'])) { 
		if (isset($_GET['subject'])) { 
			if (isset($_GET['message'])) {
	
				sendEmailText($_GET['name'], $_GET['email'], $_GET['subject'], $_GET['message']);
				
				$rc = "<b>Thank you very much.</b><br><br>Your message<br>" .
					"<br>Name: " . $_GET['name'] . 
					"<br>Email: " . $_GET['email'] . 
					"<br>Subject: " . $_GET['subject'] . 
					"<br>Text: " . $_GET['message'] . 
					"<br><br>has been sent to us.";
				
				echo $rc;
			}
			else sendError("Please fill in all required fields.<br>Missing message.");
		}
		else sendError("Please fill in all required fields.<br>Missing subject.");
	}
	else sendError("Please fill in all required fields.<br>Missing email.");
}
else sendError("Please fill in all required fields.<br>Missing name.");

?>
