<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<style type="text/css">
		h3{
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			-o-user-select: none;
			user-select: none;
		}
		#q2, #q3, #q4, #q5{
			display: none;
			border: 1px;
		}
	</style>
</head>
<body>
<?php
		$yea = 0;
      if ($_POST[year] == a){$yea++;}
      if ($_POST[dev] == b){$yea++;}
      if ($_POST[lic] == a){$yea++;}
      if ($_POST[rashi] == a){$yea++;}
      if ($_POST[develstudio] == c){$yea++;}
	?>
	<form method="POST">
	<div id="q1">
			<h3>Решите уравнение (5x - 2)(-x + 3)=0.</h3>
		<label for="radio">0,43</label><input type="radio" name="year" value="a"><br>
		<label for="radio">0,34</label><input type="radio" name="year" value="b"><br>
		<label for="radio">0,56</label><input type="radio" name="year" value="c"><br><br>
		<input type="button" name="send1" onclick="viewdiv('q2')" href="javascript:void(0);" value="Далее">
	</div>
	<div id="q2">
		<h3>Решите уравнение ( -2x + 1)( -2x - 7)=0.</h3>
		<label for="radio">-3,5 и 0,5</label><input type="radio" name="dev" value="a"><br>
		<label for="radio">5 и 2,5</label><input type="radio" name="dev" value="b"><br>
		<label for="radio">2 и 7,2</label><input type="radio" name="dev" value="c"><br><br>
		<input type="button" name="send2" onclick="viewdiv('q3')" href="javascript:void(0);" value="Далее">
	</div>
	<div id="q3">
		<h3>PHP распространяется по</h3>
		<label for="radio">собственной лицензии</label><input type="radio" name="lic" value="a"><br>
		<label for="radio">GNU GPL</label><input type="radio" name="lic" value="b"><br>
		<label for="radio">не имеет лицензию</label><input type="radio" name="lic" value="c"><br><br>
		<input type="button" name="send3" onclick="viewdiv('q4')" href="javascript:void(0);" value="Далее">
	</div>
	<div id="q4">
		<h3>Какое расширение файлов у PHP</h3>
		<label for="radio">.php</label><input type="radio" name="rashi" value="a"><br>
		<label for="radio">.phpt</label><input type="radio" name="rashi" value="b"><br>
		<label for="radio">.php</label><input type="radio" name="rashi" value="c"><br><br>
		<input type="button" name="send4" onclick="viewdiv('q5')" href="javascript:void(0);" value="Далее">
	</div>
	<div id="q5">
		<h3>Что такое PHP Devel Studio?</h3>
		<label for="radio">текстовый редактор</label><input type="radio" name="develstudio" value="a"><br>
		<label for="radio">конструктор сайтов PHP</label><input type="radio" name="develstudio" value="b"><br>
		<label for="radio">среда для создания графических PHP-приложений</label><input type="radio" name="develstudio" value="c"><br><br>
		<input type="button" name="send5" onmousedown="enablebutton()" value="Далее">
	</div><br>
		<input type="submit" name="send" onmousedown="viewDiv()" disabled>
		<p>Правильных - <?php echo $yea; ?> из 5</p>
		<?php
		 if ($_POST[send]) {
		 	if ($yea > 2) {
				echo "Отлично! Ваша оценка 5";
			}
			if ($yea <= 2) {
				echo "Могло бы быть и лучше! Ваша оценка 3";
			}
		 }
		?>
	</form>
	<script type="text/javascript">		
		var show;
		function viewdiv(id){
		param=document.getElementById(id);
		if(param.style.display == "none") {
		if(show) show.style.display = "none";
		param.style.display = "block";
		show = param;
		}else param.style.display = "none";
		}
		function enablebutton(){
			var btn = document.querySelector("[type=button]");
			document.querySelector("input[name='send']").removeAttribute("disabled");
		}
	</script>
</body>
</html>