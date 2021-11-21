///function viewDiv('q2') {
/////	document.getElementById("q2").style.display = "block";
/////}
/////function viewDiv('q3') {
/////	document.getElementById("q3").style.display = "block";
/////}
/////function viewDiv('q4') {
/////	document.getElementById("q4").style.display = "block";
/////};
var show;
function viewdiv(id){
param=document.getElementById(id);
if(param.style.display == "none") {
if(show) show.style.display = "none";
param.style.display = "block";
show = param;
}else param.style.display = "none"
}