function myFunction() {
    setTimeout(showPage, 200);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
  document.getElementById("myDiv2").style.display = "block";
  $(document).ready(function(){
  // Now to start autoTyping just call the autoType function with the 
  // class of outer div
  // The second paramter is the speed between each letter is typed.   
  autoType(".type-js",200);
});
}