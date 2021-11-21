<?php
session_start();
	if ($_GET['action'] == 'logout') {
		unset($_SESSION['login']);
		header("location:index.php");
	}
		?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Опрос</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<?php
	if ($_SESSION['login']) {
		echo "Добро пожаловать, ", $_SESSION['login'];
	 	}	
	 if ($_POST['into']) {
	 		$file = 'data.log';
			$users = file($file);
			$name = $_POST['name'];
			$surname = $_POST['surname'];
			$otchestvo = $_POST['otchestvo'];
		foreach ($users as $user) {
		$usr_info = explode("#", $user);
		$write = "Такого не знаю, ты ошибся сайтом, друг.";
			if (trim($name) == trim($usr_info[0]) && trim($surname) == trim($usr_info[1]) && trim($otchestvo) == trim($usr_info[2])) {
				$_SESSION['login'] = $name;
				$write = "Вы успешно зашли на сайт";
			}
		}
	}
		echo "<p id='notify'>.$write.</p>";

?>
<body>
	<?php
		if (!$_SESSION['login']) {
	?>
	<h2>Войдите на сайт</h2>
	<form method="POST">
		<input type="text" name="name" placeholder="Имя"><br><br>
		<input type="text" name="surname"placeholder="Фамилия"><br><br>
		<input type="text" name="otchestvo"placeholder="Отчество"><br><br>
		<input type="submit" name="into" value="Войти">
	</form>
	<?php
			}
		else
			include 'answer.php';
		if ($_SESSION['login']) {
		echo '<br><a href="index.php?action=logout">Выход</a>';
		}
	?>
</body>
</html>