// https://stackoverflow.com/questions/6941533/get-protocol-domain-and-port-from-url
function get_host()
{
    var url = window.location.href;
    var arr = url.split("/");
    var result = arr[0] + "//" + arr[2];
    return result
}

function getAllPosts(url) {
      return fetch(url, {
          method: "GET", 
          mode: "cors", 
          cache: "no-cache", 
          credentials: "same-origin", 
          headers: {
              "Content-Type": "application/json"
          },
          redirect: "follow", 
          referrer: "no-referrer", 
      })
      .then(response => response.json()); // parses response to JSON
}

function deletePost(id){
    let url = "/myBlog/posts/"+id;
    return fetch(url, {
        method: "DELETE", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
            "x-csrftoken": csrf_token
        },
        redirect: "follow", 
        referrer: "no-referrer", 
    })
    .then(document.location.reload(true)); //https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
}

function commentPost(id){
    let commentForm =
    {
        "query": "addComment",
        "comment":
        {
            "comment":"",
            "contentType":"text/plain"
        }
    }
    commentForm.comment.comment= document.getElementById("commentInput").value;
    // TODO: Comment a post
    let body = JSON.stringify(commentForm);
    console.log(body)
    let url = "/myBlog/posts/"+id+"/comments/";
    return fetch(url, {
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        body: body,
        headers: {
            "Content-Type": "application/json",
            "x-csrftoken": csrf_token
        },
        redirect: "follow", 
        referrer: "no-referrer", 
    })
    .then(document.location.reload(true));
}