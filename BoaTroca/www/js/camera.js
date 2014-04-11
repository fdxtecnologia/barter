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
        var address = Image.src;
        var name = setPicName.val();
        alert("nome:" + name +"uri " + address);
        if ( name == '' ) {
                alert("Insira o numero da figurinha");
        } else{
            /*
                user/post/picture/add
            */
        };
/*
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;

        ft.upload(path,
            "http://my.domain.com/upload.php",
            function(result) {
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            { fileName: name });
*/
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