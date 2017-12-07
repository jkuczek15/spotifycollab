from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt 
from secret import INIT_REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
import requests
import urllib

from .models import User

def me(request):
    # Get the access token included in the request
    access_token = request.GET['access_token']
    request_url = "https://api.spotify.com/v1/me"

    # Make a request to Spotify to information about the logged in user
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    if(response.get('error') == None):
        # We don't have an error, store this token in the database
        user_id = response['id']
        u = User(user_id, access_token)
        u.save()

    return JsonResponse(response)

def playlists(request):
    # Grab access token and user ID for the request
    access_token = request.GET['access_token'] 
    user_id = request.GET['user_id']

    # Build the request
    request_url = "https://api.spotify.com/v1/users/" + user_id + "/playlists"
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    #if(response.get('error') != None):
        # Access token is expired, set to None so we can refresh it
        #request.session['access_token'] = None

    # Format this response in JSON
    return JsonResponse(response)

def tracks(request):
    playlist_url = request.GET['playlist_url']
    request_url = playlist_url + "/tracks"
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + request.session['access_token'] })
    response = r.json()

    #if(response.get('error') != None):
        # Access token is expired
        #request.session['access_token'] = None

    # Format this response in JSON
    return JsonResponse(response)

def index(request):
    return JsonResponse({'test': 'test'})
