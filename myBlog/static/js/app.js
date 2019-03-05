var form = {
    title: "",
    content: "",
    contentType:"",
    categories: "",
    visibility: "",
    description:"",
    visibleTo:"",
    unlisted:""

}

//https://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html

var encoded="";

//function to make a get request every 30s to get current pending friend request
//https://makitweb.com/how-to-fire-ajax-request-on-regular-interval/
function getFriendReuqest(){
    $.ajax({
        url:"myBlog/friendrequest/",
        type:"get",
        success:function(data){
            console.log(data);
        },
        complete:function(data){
            setTimeout(getFriendReuqest,5000);
        },
        error:function(){
            console.log('error');
        }
    });
}

$(document).ready(function(){
    setTimeout(getFriendReuqest,5000)
});




function previewFile(){
    var preview = document.querySelector('img'); //selects the query named img
    var file= document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();
    reader.onloadend = function () {
        preview.src = reader.result;
        encoded = preview.src;
        console.log(encoded);
    }
    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}

function post() {
    form.title = document.getElementById("post-title").value;
    form.contentType = document.getElementById("post-contenttype").value;
    form.categories = document.getElementById("post-categories").value;
    form.content = document.getElementById("post-content").value;
    form.visibility = document.getElementById("post-visibility").value;
    form.description = document.getElementById("post-description").value;
    form.unlisted = document.getElementById("post-content").value;
    form.visibleTo = document.getElementById("post-visibleto").value;
    // Reference: https://stackoverflow.com/questions/9618504/how-to-get-the-selected-radio-button-s-value
    var radios = document.getElementsByName('unlisted');
    for (var i = 0, length = radios.length; i < length; i++){
        if (radios[i].checked){
            if (radios[i].value == "Yes"){
                form.unlisted = true;
            }
            else{
                form.unlisted = false;
            }
            break;
        }
    }
    form.content = form.content + encoded;

    var xhr = new XMLHttpRequest();
    console.log(xhr)
    console.log("Posting...")
    xhr.open("POST", "myBlog/posts/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("X-CSRFToken", csrf_token);
    xhr.send(JSON.stringify(form));
    console.log("Finished Posting!")

    //resetting fields
    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";
    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";
    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";
  }
function getAllPosts() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            
            var data = JSON.parse(this.responseText);
            console.log(data);
            // we get the returned data
        }
    };
    xhr.open("GET", "/myBlog/author/posts/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("x-csrf-token", csrf_token);
    xhr.send();
    
}