from django.shortcuts import render
from secret import AUTH_URL
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

    # Get the access token using the code we just got
    # Set the token in the session so we can use it in the api
    access_token = request.session['access_token'] = sapi.get_access_token(access_code)

    
    
    if(access_token == 'expired'):
        # The access code is expired, force the user to login again
        return render(request, 'index.html', {'auth_url': AUTH_URL})

    # Get the user's ID using our new access token
    response = requests.get('http://'+ request.get_host() +'/api/me', {"access_token" : access_token}).json()

    v = User.objects.filter(user_id=user_id)

    print(v)

    user_id = request.session['user_id'] = response['id']

    return render(request, 'main.html', { 'user_id' : user_id })

def main(request):
    return render(request, 'main.html', {})

def host(request):
    return render(request, 'host.html', {})

def join(request):
    return render(request, 'join.html', {})

def playlist(request):
    # Retreive the access token from the session
    access_token = request.session['access_token']
    playlist_url = request.GET['url']

    # Get the tracks for this playlist
    tracks = sapi.get_tracks(playlist_url, access_token)

    return render(request, 'playlist.html', {'data': tracks })

def refresh_token(host, access_token):
    # Get the access token and set it in the session for the API
    return requests.post('http://'+ host +'/api/token', { "access_token" : access_token }).json()