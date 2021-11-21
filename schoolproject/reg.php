<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
		<?php
	$filename = 'data.log';
	$name = $_POST['name'];
	$surname = $_POST['surname'];
	$otchestvo = $_POST['otchestvo'];
	$data = [$name, '#', $surname, '#', $otchestvo, "\n"];
	if ($_POST['save']) {
		file_put_contents($filename, $data, FILE_APPEND);
	}
	?>
</head>
<body>
	<form method="POST">
		<input type="text" name="name" placeholder="Имя"><br><br>
		<input type="text" name="surname" placeholder="Фамилия"><br><br>
		<input type="text" name="otchestvo" placeholder="Отчество"><br><br>
		<input type="submit" value="Зарегистрировать" name="save">
		</form>
</body>
</html>