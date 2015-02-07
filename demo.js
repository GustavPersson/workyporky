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
}

function getUserInfo(userId, index) {
  var xmlhttp = new XMLHttpRequest(),
    targetElem,
    out = '',
    url = "https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=b54580f369a7eeebecb2004dc429d08f&user_id=" + userId + "&format=json&nojsoncallback=1"
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var responseJson = JSON.parse(xmlhttp.responseText);
        targetElem = document.querySelector('a[data-photo-index="' + index +'"]');
        out = '<span>Image by ' + responseJson.person.username._content + ' on flickr</span>';
        targetElem.innerHTML = out;
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function createGallery() {
  var selectedImages = document.querySelectorAll('.selected'),
  photo,
  photoIndex,
  out = '';

  for(i = 0; i < selectedImages.length; i++) {
    photoIndex = selectedImages[i].dataset.photoIndex;
    photo = window.photos[photoIndex];
    out += '<h3>' + photo.title + '</h3>';
    out += '<a class="owner" data-photo-index=' + i + ' href="https://www.flickr.com/people/' + photo.owner + '/">';
    getUserInfo(photo.owner, i);
    out += '</a>';
    out += '<img data-photo-index="' + i + '" src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '.jpg"></img>';
  }
  document.getElementById("galleryarea").innerHTML = out;
}

window.addEventListener("load", function () {
  document.getElementById("flickrsearch").addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    getPictures(this.children.searchstring.value);
  });

  document.getElementById("opengallery").addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    createGallery();
  });
});
