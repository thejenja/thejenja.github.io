function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.remove("show");
      tabcontent[i].classList.add("hide");
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.remove("hide");
    document.getElementById(tabName).classList.add("show");
  
    evt.currentTarget.classList.add("active");
  }
  
  window.onload = function() {
    if (window.location.href.includes('?donate')) {
      document.getElementById("donate").classList.add("show");
    }
    else{
    document.getElementById("main").classList.add("show");
    document.getElementsByClassName("tablinks")[0].classList.add("active");  
  }
  };