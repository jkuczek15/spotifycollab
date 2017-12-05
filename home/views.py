from django.shortcuts import render
from secret import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from pprint import pprint
import requests
import urllib
import sapi

def index(request):
    # Authenticate the user using Spotify URL given to us
    auth_url = "https://accounts.spotify.com/authorize?response_type=code&client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI
    return render(request, 'index.html', {'auth_url': auth_url})

def landing(request):
    # Get the access code returned from the GET request
    access_code = request.GET.get('code')

    # Get the access code from the session or get a new one if it doesn't exist
    access_token = request.session.get('access_token', sapi.get_access_token(access_code))

    # Get the user's ID using our new access token
    user_id = request.session['user_id'] = sapi.get_user_id(access_token)

    # Make a request to get the user's playlists using the access token
    playlists = sapi.get_playlists(user_id, access_token)

    return render(request, 'landing.html', { 'data': playlists })

def playlist(request):
    # Retreive the access token from the session
    access_token = request.session['access_token']
    playlist_url = request.GET['url']

    # Get the tracks for this playlist
    tracks = sapi.get_tracks(playlist_url, access_token)

    return render(request, 'playlist.html', {'data': tracks })
