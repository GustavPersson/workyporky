function getPictures(searchString) {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=b54580f369a7eeebecb2004dc429d08f&text=" + searchString + "&format=json&nojsoncallback=1";

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var responseJson = JSON.parse(xmlhttp.responseText);
          handleResponse(responseJson);
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function handleResponse(responseJson) {
  var out = "",
    i,
    photo;
  window.photos = responseJson.photos.photo;
  for(i = 0; i < responseJson.photos.photo.length; i++) {
    photo = responseJson.photos.photo[i];
    out += '<img data-photo-index="' + i + '" src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_s.jpg" onclick="toggleSelection(this);"></img>';
  }
  document.getElementById("searchresults").innerHTML = out;
}

function toggleSelection(image) {
  var clickedImage = window.photos[image.dataset.photoIndex];
  image.classList.toggle("selected");

  console.log(clickedImage);
}

window.addEventListener("load", function () {
  document.getElementById("flickrsearch").addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    getPictures(this.children.searchstring.value);
  });
});


//when click on create album link get all with class .selected
//get big pictures of those
//display somehow