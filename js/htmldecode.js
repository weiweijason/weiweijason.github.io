function htmlDecode(input){
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  
  DB.ready(function() {
    var pluginCode = htmlDecode(document.getElementById('pluginCode').innerHTML);
    var mainCode = htmlDecode(document.getElementById('mainCode').innerHTML);
    eval.call(window, pluginCode);
    eval.call(window, mainCode);
  });