/*
Высчитываем возраст, был и в прошлой версии сайта и тоже сгенерирован в чатгпт
*/

let today = new Date();
let bday = new Date("31 August 2006");
let age = today.getFullYear() - bday.getFullYear();
let m = today.getMonth() - bday.getMonth();
if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) {
	age--;
}
