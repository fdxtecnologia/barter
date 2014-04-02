var oneWeekAgo = Math.round((new Date().setDate(new Date().getDate() - 3)) / 1000);
var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;
var friendList = [629502649, 1165377221, 1373777914, 1547432010, 1571950834, 100000446912154, 100001934282085, 100002089010840];
window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
        appId: '489987941127071', // App ID from the app dashboard
        channelUrl: 'http://localhost:8080/xeretao/channel.html', // Channel file for x-domain comms
        status: true, // Check Facebook Login status
        xfbml: true // Look for social plugins on the page
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

var infos = ["photos", "posts-like", "posts-share"];

$(document).ready(function() {
    $("#btn-buscar").click(function() {
        buscarPalavraChave($("#input-busca").val(), $("#panel-resultados-posts .panel-body"));
        buscarPalavraComentarios($("#input-busca").val(), $("#panel-resultados-comments .panel-body"));
        $("#btn-buscar").attr("disabled", "disabled");
    });
});





/*setTimeout(function() {
 FB.api({
 method: "fql.query",
 query: "select uid2 from friend where uid1 = me()"
 }, function(response) {
 for (var rp in response) {
 var friend = response[rp];
 friendList.push(friend.uid2);
 }
 });
 FB.api("/me?fields=name,picture.type(square)", function(response){
 $(".user-name").html(response.name);
 $(".user-avatar").html("<img src='"+response.picture.data.url+"' />")
 });
 //fillDashboard(infos);
 }, 4000);*/

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
                if (response.authResponse) {
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

/**
 * 
 * @param {string} key palavra chave a ser buscada
 * @returns boolean se a requisição foi efetuada
 */
function buscarPalavraChave(key) {
    var oneWeekAgo = Math.round((new Date().setDate(new Date().getDate() - 3)) / 1000);
    var dest = $("#panel-busca-posts div");
    FB.api({
        method: 'fql.multiquery',
        queries: {
            query1: "SELECT actor_id, source_id, post_id, message, like_info, comment_info, share_info FROM stream WHERE filter_key IN (SELECT filter_key FROM stream_filter WHERE type = 'newsfeed' and uid = me())   and created_time > " + oneWeekAgo + " and type IN (45, 56, 128, 247, 308) limit 150",
            query2: "SELECT uid, name, pic_small FROM user WHERE uid IN (SELECT actor_id FROM #query1)",
            query3: "SELECT page_id, name, pic_small FROM page where page_id IN (SELECT actor_id FROM #query1)"
        }
    }, function(response) {
        var posts = response[0].fql_result_set;
        var sources = response[1].fql_result_set.concat(response[2].fql_result_set);
        var processedPosts = [];
        for (var i in posts) {
            var post = posts[i];
            if (post.message.toLowerCase().indexOf(key.toLowerCase()) != -1) {
                for (var x = 0; x < sources.length; x++) {
                    if (post.actor_id == sources[x].uid || post.actor_id == sources[x].page_id) {
                        post.source_pic = sources[x].pic_small;
                        post.source_name = sources[x].name;
                        break;
                    }
                }
                processedPosts.push(post);
            }
        }
        dest.prev().text("Resultados da Busca por " + key + " em postagens");
        createItemList(dest, processedPosts);
    });
}

function filtrarListaFavoritos(nome) {
    if (nome == "") {
        $("#modal-favoritos .modal-body .lista .col-md-3").show();
    } else {
        $("#modal-favoritos .modal-body .lista .col-md-3").each(function() {
            if ($(this).find("strong").text().contains(nome)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}

/**
 * 
 */
function gerarListaFavoritos() {
    FB.api({
        method: 'fql.query',
        query: 'SELECT uid, name, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())'
    }, function(response) {
        var res = "";
        for (var i in response) {
            var friend = response[i];
            var htmlFriend = '<div class="col-md-3"><div class="checkbox"><label><input type="checkbox" data-friend-id="' + friend.uid + '" />' +
                    '<img style="margin-left: 25px;" src="' + friend.pic_square + '" /> <br /><strong>' + friend.name + '</strong>' +
                    ' </label></div></div>';
            res += htmlFriend;
        }
        $("#modal-favoritos .modal-body .lista").empty().append(res);
    });
}


function saveAndReloadFavoritos() {
    friendList = [];
    $("#modal-favoritos .modal-body input[type=checkbox]:checked").each(function() {
        friendList.push($(this).data("friend-id"));
    });
    
    if (friendList.length > 0) {
        var listaStr = friendList.join(",");
        var dest = $("#panel-posts-favoritos div");
        dest.empty().append("<img src='/xeretao/img/load.gif' />");
        FB.api({
            method: 'fql.multiquery',
            queries: {
                query1: "SELECT post_id, message,attachment, like_info, comment_info, share_info, actor_id FROM stream WHERE filter_key IN (SELECT filter_key FROM stream_filter WHERE type = 'newsfeed' and uid = me()) and actor_id in (" + listaStr + ") order by like_info.like_count desc limit 20",
                query2: "SELECT uid, name, pic_small FROM user WHERE uid IN (SELECT actor_id FROM #query1)"
            }
        }, function(response) {
            var posts = response[0].fql_result_set;
            var sources = response[1].fql_result_set;
            var processedPosts = [];
            for (var i in posts) {
                var post = posts[i];
                for (var x = 0; x < sources.length; x++) {
                    if (post.actor_id == sources[x].uid) {
                        post.source_pic = sources[x].pic_small;
                        post.source_name = sources[x].name;
                        break;
                    }
                }
                processedPosts.push(post);
            }
            if (processedPosts.length > 0) {
                createItemList(dest, processedPosts);
            } else {
                dest.empty().text("Não existem postagens recentes dos seus favoritos");
            }
        });
    } else {
        $("#panel-posts-favoritos .list-group").text("Você não possui nenhum amigo Favorito");
    }
}
/**
 * 
 * @param {string} palavra chave da busca
 * @param {jQuery} destination chave da busca
 * @returns {void} 
 */
function buscarPalavraComentarios(palavra, destination) {
    destination.empty().append("<img src='/xeretao/img/load.gif' />");
    FB.api("/me/home?fields=id,message,picture,full_picture,from,name,description,comments.filter(toplevel).limit(10).fields(id,message,from,like_count,attachment,comment_count)&since=" + oneWeekAgo, function(response) {
        destination.empty();
        var list = $("<ul class='list-group'>");
        var postList = [];
        for (var i in response.data) {
            var p = {
                commentList: []
            };

            var post = response.data[i];
            var comments = post.comments;
            if (!comments) {
                continue;
            }
            var j = 0;
            for (j in comments.data) {
                var comment = comments.data[j];
                if (comment.message.toLowerCase().contains(palavra.toLowerCase())) {
                    p.commentList.push(comment);
                }
            }
            if (p.commentList.length > 0) {
                p.name = post.from.name;
                p.id = post.id;
                if (post.picture != undefined) {
                    p.picture = post.picture;
                }
                if (post.full_picture != undefined) {
                    p.full_picture = post.full_picture;
                }
                if (post.message != undefined) {
                    p.message = post.message;
                }
                postList.push(p);
            }
        }
        var list = $("<ul class='list-group'>");
        for (var x in postList) {
            var postagem = postList[x];
            var li = $("<li class='list-group-item'>");
            var html = "" +
                    "<div>" +
                    "<h4><strong>" + postagem.name + "</strong></h4><br />" + (postagem.message != undefined ? postagem.message : "") +
                    (postagem.full_picture != undefined ? "<br /><img src='" + postagem.full_picture + "' style='max-width: 400px;'/>" : "") +
                    "</div>";
            li.append(html);
            addCommentBlock(postagem.id, "", li);
            list.append(li);
        }
        destination.empty().append(list);
        console.log(postList);
    });
}



var palavras;
function gerarTagCloud() {
    var tags = [];
    FB.api({
        method: "fql.query",
        //46,  80, 257
        query: "SELECT post_id, message FROM stream WHERE filter_key IN (SELECT filter_key FROM stream_filter WHERE type = 'newsfeed' and uid = me()) and created_time > "
                + oneWeekAgo + " and type IN (46,80,257) limit 150"
    }, function(response) {
        var pattern = /(\w(â|á|ã|é|ê|õ|ô|ó|í|ú)?)+/gi;
        for (var i in response) {
            var post = response[i];
            var matches = post.message.toString().match(pattern);
            for (var j in matches) {
                var palavra = matches[j];
                if (palavra.length > 5) {
                    if (!tags[palavra]) {
                        var obj = {word: palavra, weight: 1};
                        tags.push(obj);
                    } else {
                        for (var k in tags) {
                            if (tags[k].word == palavra) {
                                tags[k].weight = tags[k].weight + 1;
                            }
                        }
                    }
                }
                if (tags.length > 15) {
                    break;
                }
            }
        }
        var word_list = [];
        for (var k in tags) {
            var t = tags[k];
            word_list.push({word: t.word, weight: t.weight});
        }
        palavras = word_list;
        $("#panel-tagcloud .panel-body").jQCloud(word_list);
    });
}


/**
 * 
 * @returns html com o as fotos mais curtidas
 */
function fotosMaisCurtidas() {
    var dest = $("#panel-curtidas-fotos div");
    dest.empty().append("<img src='/xeretao/img/load.gif' />");
    FB.api({
        method: 'fql.multiquery',
        queries: {
            query1: "SELECT post_id, message,attachment, like_info, comment_info, share_info, actor_id FROM stream WHERE filter_key IN (SELECT filter_key FROM stream_filter WHERE type = 'newsfeed' and uid = me()) and type IN (247) and like_info.like_count > 0 order by like_info.like_count desc limit 20",
            query2: "SELECT uid, name, pic_small FROM user WHERE uid IN (SELECT actor_id FROM #query1)",
            query3: "SELECT page_id, name, pic_small FROM page where page_id IN (SELECT actor_id FROM #query1)"
        }
    }, function(response) {
        var posts = response[0].fql_result_set;
        var sources = response[1].fql_result_set.concat(response[2].fql_result_set);
        var processedPosts = [];
        for (var i in posts) {
            var post = posts[i];
            for (var x = 0; x < sources.length; x++) {
                if (post.actor_id == sources[x].uid || post.actor_id == sources[x].page_id) {
                    post.source_pic = sources[x].pic_small;
                    post.source_name = sources[x].name;
                    break;
                }
            }
            processedPosts.push(post);
        }
        createItemList(dest, processedPosts);
    });
}

function replaceAll(string, token, newtoken) {
    while (string.indexOf(token) != -1) {
        string = string.replace(token, newtoken);
    }
    return string;
}

function createItemList(target, postList) {
    target.empty();
    for (var i in postList) {
        var post = postList[i];
        var attachment = "";
        if (post.attachment != undefined) {
            if (post.attachment.fb_object_type == "photo" || post.attachment.fb_object_type == "album") {
                var foto = post.attachment.media[0].src;
                attachment = "<img src='" + foto + "' />";
            } else if (post.attachment.media != undefined && post.attachment.media[0].type == "link") {
                var obj = post.attachment.media[0];
                var link = "";
                attachment = "<div class='well'>"
                        + "<a href='" + obj.href + "'>"
                        + "<img src='" + obj.src + "' /><br />"
                        + "<span>" + post.attachment.name + "</span>"
                        + "</a>"
                        + "</div>";
            }
        }
        var links = post.message.match(urlPattern);
        for (var matches in links) {
            var match = links[matches];
            var link = "<a href='" + match + "'>" + match + "</a>";
            post.message = post.message.replace(match, link);
        }
        var socialButtons = "<div>"
                + "<span class='glyphicon glyphicon-thumbs-up' style='padding: 0px 5px'></span>" + post.like_info.like_count
                + "<span class='glyphicon glyphicon-comment' style='padding: 0px 5px'></span>" + post.comment_info.comment_count
                + "<span class='glyphicon glyphicon-bullhorn' style='padding: 0px 5px'></span>" + post.share_info.share_count
                + "</div>";
        var html = "<h4 class='list-group-item-heading'>"
                + "<table><tr>"
                + "<td><img src='" + post.source_pic + "' /></td><td>" + post.source_name + "</td>"
                + "</tr></table></h4>"
                + "<p class='list-group-item-text'>"
                + (post.message != undefined ? replaceAll(post.message, "\n", "<br />") + "<br />" : "")
                + (attachment != "" ? attachment : "") + "<br />"
                + socialButtons
                + "</p>";
        var a = $("<a href='#' class='list-group-item' data-post='" + post.post_id + "'>").append(html);
        a.click(function() {
            carregarPost($(this).data("post"));
        });
        target.append(a);
    }
}

function postsMaisCurtidos() {
    var dest = $("#panel-curtidas-posts div");
    dest.empty().append("<img src='/xeretao/img/load.gif' />");
    FB.api({
        method: 'fql.multiquery',
        queries: {
            query1: "SELECT post_id, message,attachment, like_info, comment_info, share_info, actor_id FROM stream WHERE filter_key IN (SELECT filter_key FROM stream_filter WHERE type = 'newsfeed' and uid = me()) and like_info.like_count > 0 order by like_info.like_count desc limit 20",
            query2: "SELECT uid, name, pic_small FROM user WHERE uid IN (SELECT actor_id FROM #query1)",
            query3: "SELECT page_id, name, pic_small FROM page where page_id IN (SELECT actor_id FROM #query1)"
        }
    }, function(response) {
        var posts = response[0].fql_result_set;
        var sources = response[1].fql_result_set.concat(response[2].fql_result_set);
        var processedPosts = [];
        for (var i in posts) {
            var post = posts[i];
            for (var x = 0; x < sources.length; x++) {
                if (post.actor_id == sources[x].uid || post.actor_id == sources[x].page_id) {
                    post.source_pic = sources[x].pic_small;
                    post.source_name = sources[x].name;
                    break;
                }
            }
            processedPosts.push(post);
        }

        createItemList(dest, processedPosts);
    });
}

/**
 * 
 * */
function postsMaisCompartilhados() {
    var dest = $("#panel-shares-posts div");
    dest.empty().append("<img src='/xeretao/img/load.gif' />");
    FB.api({
        method: 'fql.multiquery',
        queries: {
            query1: "SELECT post_id, message,attachment, like_info, comment_info, share_info, actor_id FROM stream WHERE filter_key IN (SELECT filter_key FROM stream_filter WHERE type = 'newsfeed' and uid = me()) and share_info.share_count > 0 order by share_info.share_count desc limit 20",
            query2: "SELECT uid, name, pic_small FROM user WHERE uid IN (SELECT actor_id FROM #query1)",
            query3: "SELECT page_id, name, pic_small FROM page where page_id IN (SELECT actor_id FROM #query1)"
        }
    }, function(response) {
        var posts = response[0].fql_result_set;
        var sources = response[1].fql_result_set.concat(response[2].fql_result_set);
        var processedPosts = [];
        for (var i in posts) {
            var post = posts[i];
            for (var x = 0; x < sources.length; x++) {
                if (post.actor_id == sources[x].uid || post.actor_id == sources[x].page_id) {
                    post.source_pic = sources[x].pic_small;
                    post.source_name = sources[x].name;
                    break;
                }
            }
            processedPosts.push(post);
        }

        createItemList(dest, processedPosts);
    });
}

/**
 * @param {type} fields campos que serão retornados
 */
function fillDashboard(fields) {
    for (var i in fields) {
        var field = fields[i];
        if (field === "photos") {
            fotosMaisCurtidas();
        }
        if (field === "posts-like") {
            postsMaisCurtidos();
        }

        if (field === "posts-share") {
            postsMaisCompartilhados();
        }
    }
}

/**
 * 
 * @param {type} postId
 * @param {type} qtdComments
 * @param {type} block
 * @returns {undefined}
 */
function addCommentBlock(postId, qtdComments, block) {
    var hr = $("<hr />");
    var well = $("<div class='well well-sm'>");

    var ulComments = $("<ul class='list-group' id='comment-list-'" + postId + ">");
    var link = $("<a href='#'>" + qtdComments + " comentários</a>");

    well.append(link).append(ulComments);

    if (qtdComments > 0 || qtdComments == "") {
        link.click(function() {
            ulComments.empty();
            FB.api('/' + postId + '/comments?fields=id,message,like_count,user_likes,from.fields(picture,name)', function(response) {
                for (var i = 0; i < response.data.length; i++) {
                    var comment = response.data[i];
                    var li = $("<li class='list-group-item'>");
                    var html = "<span class='comment'>" +
                            "<div><h5>" + comment.from.name + "</h5>" +
                            "<img src='" + comment.from.picture.data.url + "' style=''/>" +
                            comment.message +
                            "</div>" +
                            "</span>";
                    li.append(html);
                    ulComments.append(li);
                }
            });
            return false;
        });
    }
    var inputCommentBox = $('<input type="text" class="form-control" id="comment-' + postId + '" placeholder="Comentar">' +
            '<span class="input-group-btn">' +
            '<button class="btn btn-xs btn-success" id="btn-buscar" onclick="sendComment(\'' + postId + '\')" type="button">Enviar!</button>' +
            '</span>');
    well.append(inputCommentBox);

    block.append(well);
}



/**
 * 
 * @param {int} sourceId
 * @param {unsigned int32} likeCount quantidade de likes que o objeto tem
 * @param {boolean} userLikes se o usuario ja curte o objeto
 * @returns {void}
 * adiciona um botao de like a um objeto. Esse é um toggleButton cuja a ação
 * de toggle é like/unlike o objeto
 */
function addLikeButton(sourceId, likeCount, userLikes) {
    var p = $("<p>");
    var html = "<a onclick='likeObject(" + sourceId + ")' id='like_'" + sourceId + ">" + userLikes ? "Curtir" : "Curti!" + "(" + likeCount + ")</a>";
    p.append(html);
    return p;
}

function likeObject(sourceId) {
    FB.api("/" + sourceId + "/likes", 'post', function(response) {
        if (!response || response.error) {
            alert("Erro");
        } else {
            console.log(response);
        }
    });
}

/**
 * 
 * @param {int} postId
 * @returns {undefined}
 */
function sendComment(postId) {
    FB.api("/" + postId + "/comments", 'post', {message: $("#comment-" + postId).val()}, function(response) {
        if (!response || response.error) {
            alert("Erro");
        } else {
            console.log(response);
        }
    });
}



function loadFavorites() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            var uid = response.authResponse.userID;
            $.ajax({
                url: "/xeretao/home/loadFavorites",
                data: "id=" + uid,
                success: function(response) {
                    return JSON.parse(response);
                }
            });
        } else {
            // the user isn't logged in to Facebook.
        }
    });
}

function saveFavorites() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            var uid = response.authResponse.userID;
            $.ajax({
                url: "/xeretao/home/loadFavorites",
                data: "id=" + uid,
                success: function(response) {
                    return JSON.parse(response);
                }
            });
        } else {
            // the user isn't logged in to Facebook.
        }
    });
}

function carregarPost(postId) {
    FB.api("/" + postId + "?fields=picture,likes.summary(true).limit(1),from.fields(name,picture),comments.summary(true)", function(response) {
        var post = response;
        $("#img-post").empty().append("<img src='" + post.from.picture.data.url + "' />");
        $("#autor-post").empty().text(post.from.name);
        $("#modal-post").modal("show");
        console.log(response);
    });
}