function makeFileList() {
  var input = document.getElementById("attachment");
  var ul = document.getElementById("fileList");
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.firstChild);
  }
  for (var i = 0; i < input.files.length; i++) {
    console.log(input.files[i]);
    var li = document.createElement("li");
    li.innerHTML = input.files[i].name;
    ul.appendChild(li);
  }
  if(!ul.hasChildNodes()) {
    var li2 = document.createElement("li");
    li2.innerHTML = 'No Files Selected';
    ul.appendChild(li2);
  }
}