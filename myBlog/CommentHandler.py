from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, render,get_list_or_404
from .models import Post, Author, Comment, Friend, Node, RemoteUser
from .serializers import PostSerializer, CommentSerializer, AuthorSerializer, CustomPagination, FriendSerializer
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from . import Helpers
import requests
from requests.auth import HTTPBasicAuth
import json

class CommentHandler(APIView):
    def get(self, request, postid, format=None):
        if (not Post.objects.filter(pk=postid).exists()):
            return Response("Post couldn't find", status=404)
        else:
            post = Post.objects.get(pk=postid)
            if (not Helpers.verify_current_user_to_post(post, request)):
                responsBody={
                    "query": "getComment",
                    "success":False,
                    "message":"Comment not allowed"
                    }
                return Response(responsBody, status=403)
            else:
                current_user_uuid = Helpers.get_current_user_uuid(request)
                comments_list = get_list_or_404(Comment,postid=postid)
                paginator = CustomPagination()
                results = paginator.paginate_queryset(comments_list, request)
                serializer=CommentSerializer(results, many=True)
                return paginator.get_paginated_response(serializer.data)

    def post(self, request, postid, format=None):
        if request.user.is_authenticated:
            if (not Post.objects.filter(pk=postid).exists()):
                return Response("Post couldn't find", status=404)
            else:
                data = request.data
                if data['query'] == 'addComment':
                    post = Post.objects.get(pk=postid)
                    postOrigin = post.origin
                    for node in Node.objects.all():
                        if str(node.host) in str(postOrigin):
                            nodeURL = node.host+"posts/"+str(post.postid)+"/comments/";
                            headers = {"Content-Type": 'application/json', "Accept": 'application/json'}
                            remote_to_node = RemoteUser.objects.get(node=node)
                            if "dispersal" in node.host:
                                author_url = data["comment"]["author"]["url"]
                                data["comment"]["author"]["url"] = author_url.replace("/author/", "/service/author/")
                            data = json.dumps(data)
                            response = requests.post(nodeURL, headers=headers,data = data,auth=HTTPBasicAuth(remote_to_node.remoteUsername, remote_to_node.remotePassword))
                            print(response)
                            if response.status_code == 200:
                                responsBody={
                                "query": "addComment",
                                "success":True,
                                "message":"Comment Added"
                                }
                                return Response(responsBody, status=status.HTTP_200_OK)
                            else:
                                responsBody={
                                "query": "addCoemment",
                                "success":False,
                                "message":"Comment not allowed"
                                }
                                return Response(responsBody, status=403)
                                
                    author = Helpers.get_or_create_author_if_not_exist(data['comment']['author'])
                    serializer = CommentSerializer(data=data['comment'], context={'author': author, 'postid':postid})

                    if serializer.is_valid():
                        serializer.save()
                        responsBody={
                        "query": "addComment",
                        "success":True,
                        "message":"Comment Added"
                        }
                        return Response(responsBody, status=status.HTTP_200_OK)
                    
                    else:
                        print("an error happend: %s"%str(serializer.errors))
                        responsBody={
                        "query": "addCoemment",
                        "success":False,
                        "message":"Comment not allowed"
                        }
                        return Response(responsBody, status=403)
                else:
                    responsBody={
                    "query": "addCoemment",
                    "success":False,
                    "message":"Comment not allowed"
                    }
                    return Response(responsBody, status=403)

        else:
            return Response("Unauthorized", status=401)

    