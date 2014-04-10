//"Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {
    /* ---------------------------------- Local Variables ---------------------------------- */
    var content = $( '#mainContent' );
    var leftPanel = $( '#left-panel' );
    var rightPanel = $('#right-panel');
    var home = $('#div2');
    var myPictures = $('#div3');
    var addPictures = $('#div4');
    var config = $('#div5');
    var login = $('#div1');

    var baseUrl = "http://localhost:8080/barterserver/";

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
    
          
    function init(sessao) {
        console.log("app initialized");

        //login verification
        //if localStorage has login info then open aplication - if not, opens login page
        if (sessao != NULL) { //login invalid
            //call login page

                buscaLocalizacao();
                var latitude = $("#hdnlatitude").val();
                var longitude = $("#hdnlongitude").val();


                var userJson = {'user.name':sessao.usuario.name,'user.email':sessao.usuario.email,'user.password':sessao.usuario.password,'user.age':sessao.usuario.age, 'user.loc_lat':latitude, 'user.loc_long':longitude};

                $.getJSON("http://localhost:8080/barterserver/user/post/save", userJson, function(json){
                    var sessao = {
                        usuario: {
                        password: json.password,
                        email: json.email,
                        name: json.name,
                        age: json.age
                        }
                    };
                    loadHome();
                });


                loadHome();
                console.log("Event Handlers initialized");
                $(this).remove();
                delete init;
           
        } else {
            loadLogin();
            $(this).remove();
            delete init;
        };
    };


      window.fbAsyncInit = function() {
                // init the FB JS SDK
                FB.init({
                    appId: '489987941127071', // App ID from the app dashboard
                    status     : true, // check login status
                    cookie     : true, // enable cookies to allow the server to access the session
                    xfbml      : true  // parse XFBML
                });
            };

            // Load the SDK asynchronously
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));


            function checkLogin(callback) {
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        console.log("connected");
                        var uid = response.authResponse.userID;
                        var accessToken = response.authResponse.accessToken;
                        callback(accessToken);
                        return true;
                    } else if (response.status === 'not_authorized') {
                        console.log("Not authorized");
                        return false;
                    } else {
                        console.log("Tentando Login");
                        FB.login(function(response) {
                            if(response.authResponse) {
                                callback();
                                return true;
                            } else {
                                alert("Não foi possivel efetuar o login no facebook");
                                return false;
                            }
                        }, {scope: "email, publish_stream, user_birthday, user_location, user_work_history user_about_me, user_hometown, user_friends, read_stream"});
                    }
                });
            }




        $(document).ready(function() {
            $("#btn_login").click(function() {
                              
                
                return checkLogin(function() {

                   
                    // Here we specify what we do with the response anytime this event occurs. 
                   
                    FB.api("/me?fields=name,email,id,birthday", function(response) {
                
                        var params = {
                          usuario: {
                            id: response.id,
                            email: response.email,
                            name: response.name,
                            birthday: response.birthday,
                           
                          }
                        };
                        
                        var accessToken = "asdfasfafasfasfdafas";
                        //console.log(response);
                        //console.log("User ID: "+params.usuario.id);
                        //console.log("User Name: "+params.usuario.name);
                        //console.log("User Email: "+params.usuario.email);
                        //console.log("User birthday: "+params.usuario.birthday);
                        //console.log("User Token: "+accessToken);
                        buscaLocalizacao();
                        var latitude = $("#hdnlatitude").val();
                        var longitude = $("#hdnlongitude").val();

                        Hoje = new Date();
                        Mes = Hoje.getMonth();
                        Mes++;
                        Ano = Hoje.getFullYear();

                        mesBirthday = params.usuario.birthday.substr(0,2);
                        anoBirthday = params.usuario.birthday.substr(6,4);

                        month = Mes - mesBirthday;

                        if(month >= 0){
                          age = Ano - anoBirthday;
                        }else{
                          age = Ano - anoBirthday;
                          age--;
                        }

                        //console.log("Idade: "+age);
                        //console.log(month);

                        var userJson = {'user.name':params.usuario.name,'user.email':params.usuario.email,'user.password':accessToken,'user.age':age, 'user.loc_lat':latitude, 'user.loc_long':longitude};

                        $.getJSON("http://localhost:8080/barterserver/user/post/save", userJson, function(json){
                            var sessao = {
                                usuario: {
                                password: json.password,
                                email: json.email,
                                name: json.name,
                                age: json.age
                                }
                            };
                            loadHome();
                        });

                        /*$.ajax({
                          type: "GET",
                          url: "http://localhost:8080/barterserver/user/post/save",
                          data: {'user.name':params.usuario.name,'user.email':params.usuario.email,'user.password':accessToken,'user.age':age, 'user.loc_lat':latitude, 'user.loc_long':longitude},
                          dataType: "application/json", 
                          success: function(json) {
                              alert("susscess");
                              loadHome();
                          }
                        });*/
                        
                      }, {scope: "email, publish_stream, user_birthday, user_location, user_work_history user_about_me, user_hometown, user_friends, read_stream"})
                
                });
            });
        });


    function buscaLocalizacao(){

        var onSuccess = function(position) {
            $("#hdnlatitude").val(position.coords.latitude);
            $("#hdnlongitude").val(position.coords.longitude);
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }


    function hideDivs () {
        $('#div1').hide();
        home.hide();
        myPictures.hide();
        addPictures.hide();
        config.hide();
        $('#div6').hide();
        $('#div7').hide();
        $('#div8').hide();
        $('#div9').hide();
    };

    function loadLogin(){
        hideDivs();
        login.show();
        leftPanel.panel("close");
        rightPanel.panel("close");
    }

    function loadHome(){
        hideDivs();
        home.show();
        home.on("click", "#search", function () {
            // Procurar Figurinhas!
            alert("Bu!");
        });
        leftPanel.panel( "close" );
        rightPanel.panel("close");
    };

    function offlineDevice () {
        alert("Sem acesso à internet!");
        //methods if device is offline
    };


    /* ---------------------------------- Buttons Behavior ---------------------------------- */
    $('#Home').on('click', function(){
        hideDivs();
        loadHome();
        leftPanel.panel("close");
    })

    $('#config').on('click', function () {
        // Comportamento ao se clicar no menu Configurações
        hideDivs();
        config.show();
        leftPanel.panel( "close" );
    });

    $('#myImages').on('click', function () {
        // Comportamento ao se clicar no menu Minhas Figurinhas
        hideDivs();
        myPictures.show();
        leftPanel.panel( "close" );
    });

    $('#upImages').on('click', function () {
        hideDivs();
        addPictures.show();
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
        /*
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
        }*/
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
