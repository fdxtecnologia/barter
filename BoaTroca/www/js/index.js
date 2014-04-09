//"Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {
    /* ---------------------------------- Local Variables ---------------------------------- */
    var content = $( '#mainContent' );
    var leftPanel = $( '#left-panel' );
    var home = $('#div2');

    /* --------------------------------- Event Registration -------------------------------- */
    document.addEventListener('deviceready', function () {
        console.log("device is ready");
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Boa Troca", // title
                    'OK'        // buttonName
                );
            };
        }

    }, false),

    //document.addEventListener("offline", offlineDevice, false),
    document.addEventListener('backbutton', loadHome , false),
    //document.addEventListener("pause", /* function */, false),
    //document.addEventListener("menubutton", /* function */, false),

    window.addEventListener('load', function(){
        new FastClick(document.body);
        console.log("FastClick loaded");
        init();
    }, false );

    /* ---------------------------------- Local Functions ---------------------------------- */
    function init() {
        console.log("app initialized");

        //login verification
        //if localStorage has login info then open aplication - if not, opens login page
        var a = 1;
        var b = 1;
        if (a == b) { //login invalid
            //call login page
            $('#div1').on("click", "button", function () {
                loadHome();
                console.log("Event Handlers initialized");
                $(this).remove();
                delete init;
            });
        } else{
            //call loadHome();
            delete init;
        };
    };

    function hideDivs () {
        $('#div1').hide();
        home.hide();
        $('#div3').hide();
        $('#div4').hide();
        $('#div5').hide();
        $('#div6').hide();
        $('#div7').hide();
        $('#div8').hide();
        $('#div9').hide();
    };

    function loadHome(){
        hideDivs();
        home.show();
        home.on("click", "#search", function () {
            // Procurar Figurinhas!
            alert("Bu!");
        });
    };

    function offlineDevice () {
        // body...
        alert("Sem acesso à internet!");
        //methods if device is offline
    };


    /* ---------------------------------- Buttons Behavior ---------------------------------- */
    $('#config').on("click", function () {
        // Comportamento ao se clicar no menu Configurações
        leftPanel.panel( "close" );
    });

    $('#myImages').on('click', function () {
        // Comportamento ao se clicar no menu Minhas Figurinhas
        hideDivs();
        $('#div3').show();
        leftPanel.panel( "close" );
    });

    $('#upImages').on('click', function () {
        hideDivs();
        $('#div4').show();
        leftPanel.panel( "close" );
    });

    $('#takePicture').on('click', takePicture);
    $('#selectPicture').on('click', selectPicture);
    $('#uploadPicture').on('click', uploadPicture);



    /* ---------------------------------- Camera Function ---------------------------------- */
    
    /** * Take picture with camera */
    function takePicture() {
        navigator.camera.getPicture(function(uri) {
            var img = document.getElementById('camera_image');
            img.style.visibility = "visible";
            img.style.display = "block";
            img.src = uri;
            document.getElementById('camera_status').innerHTML = "Success";
        },
        function(e) {
            console.log("Error getting picture: " + e);
            document.getElementById('camera_status').innerHTML = "Error getting picture.";
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI});
    };

    /** * Select picture from library */
    function selectPicture() {
        navigator.camera.getPicture( { 
            quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
    };

    /** * Upload current picture */
    function uploadPicture() {       // Get URI of picture to upload
        var img = document.getElementById('camera_image');
        var imageURI = img.src;
        if (!imageURI || (img.style.display == "none")) {
            //document.getElementById('camera_status').innerHTML = "Take picture or select picture from library first.";
            alert("Tire uma foto ou escolha do album prmeiro!");
            return;
        }
        // Verify server has been entered
        server = document.getElementById('serverUrl').value;
        if (server) {
            // Specify transfer options
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            options.chunkedMode = false;
            // Transfer picture to server
            var ft = new FileTransfer();
            ft.upload(imageURI, server, function(r) {
                document.getElementById('camera_status').innerHTML = "Upload successful: " + r.bytesSent + " bytes uploaded.";
                },
                function(error) {
                    document.getElementById('camera_status').innerHTML = "Upload failed: Code = " + error.code;
                }, options
            );
        }
    };

    /*
    function checkPreAuth(){
        var form = $("#loginForm");
        if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
            $("username", form).val(window.localStorage["username"]);
            $("password", form).val(window.localStorage["password"]);
            return false;
        }else{
            return true;
        };
    };

    function handleLogin () {
        var form = $("#loginForm");
        var u = $("#username", form).val();
        var p = $("#password", form).val();
    };
    */

}());
