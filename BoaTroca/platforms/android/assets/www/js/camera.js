    /* ---------------------------------- Local Variables ---------------------------------- */
    var baseUrl = "http://192.168.0.108/barterserver/";

    /* ---------------------------------- Camera Function ---------------------------------- */
    
    // Called when capture operation is finished
    function captureSuccess(mediaFiles) {
        var imgPath = mediaFiles[0].fullPath;
        onPhotoURISuccess(imgPath);
    };

    // Called if something bad happens
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    };

    function captureImage() {
        // Launch device camera application
        navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
    };

    // Upload files to server
    function uploadFile() {
        var Image = document.getElementById('smallImage');
        var address = Image.src
;       var name = setPicName.val();
        alert("nome:" + name +"uri " + address);
        if ( name == '' ) {
                alert("Insira o numero da figurinha");
        } else{
            /*
                send picture to server
                user/post/picture/add
            */

            $.ajax({
                type: "post",
                url: baseUrl + "user/post/picture/add",
                dataType: "json",
                data: {'user.id': window.localStorage.getItem("userId"), 'picture.title': name, 'image': Image },
                success: null
            });
        };
    };

    // Called when a photo is succesfsully retrieved
    function onPhotoURISuccess(imageURI) {
        // Get image handle
        var Image = document.getElementById('smallImage');
        Image.style.display = 'block';
        Image.src = imageURI;
        setPicName.show();
        $('#uploadPicture').show();
    };

    //Select picture from library 
    function selectPicture() {
        navigator.camera.getPicture( onPhotoURISuccess, onFail, { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
    };

    // Called if something bad happens.
    function onFail(message) {
      alert('Failed because: ' + message);
    };