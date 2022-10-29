const {ipcRenderer} = require('electron');

ipcRenderer.on('picture-in-picture', function(){
    document.querySelector("video").requestPictureInPicture();
});
