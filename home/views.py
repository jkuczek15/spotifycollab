from django.shortcuts import render
from secret import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, AUTH_URL
from pprint import pprint
import requests
import urllib
import sapi

def index(request):
    # Authenticate the user using Spotify URL given to us
    return render(request, 'index.html', {'auth_url': AUTH_URL})

def landing(request):
    # Get the access code returned from the GET request
    access_code = request.GET.get('code')

    # Get the access token using either the session or the authorization code
    if(request.session['access_token'] == None):
        access_token = request.session['access_token'] = sapi.get_access_token(access_code)
    else:   
        access_token = request.session['access_token']

    if(access_token == 'expired'):
        # The access code is expired, force them to get a new one by rendering the index page
        request.session['access_token'] = None
        return render(request, 'index.html', {'auth_url': AUTH_URL})

    # Get the user's ID using our new access token
    user_id = sapi.get_user_id(access_token)

    if(user_id == 'expired'):
        # Access token is expired, get a new one and run our request again
        access_token = request.session['access_token'] = sapi.get_access_token(access_code)
        user_id = sapi.get_user_id(access_token)

    # Make a request to get the user's playlists using the access token
    playlists = sapi.get_playlists(user_id, access_token)

    if(playlists == 'expired'):
        # Access token is expired, get a new one and run our request again
        access_token = request.session['access_token'] = sapi.get_access_token(access_code)
        playlists = sapi.get_playlists(user_id, access_token)

    return render(request, 'landing.html', { 'data': playlists })

def playlist(request):
    # Retreive the access token from the session
    access_token = request.session['access_token']
    playlist_url = request.GET['url']

    # Get the tracks for this playlist
    tracks = sapi.get_tracks(playlist_url, access_token)

    return render(request, 'playlist.html', {'data': tracks })