//add more images for new background on reload
var images = ['1.jpg'];
 $('#picture-header').css({'background': 'linear-gradient( rgba(20,20,20, .30), rgba(20,20,20, .30)), url(images/' + images[Math.floor(Math.random() * images.length)] + ')', 'background-size': 'cover', 'min-height': '75vh', 'margin-bottom': '30px'});