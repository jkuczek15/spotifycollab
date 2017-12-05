from django.shortcuts import render
from linkedin import linkedin
from secret import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
import spotipy
from pprint import pprint
import requests
import urllib

def index(request):
    # Authenticate the user using Spotify URL given to us
    redirect_uri = "http://localhost:8000/sign_in"
    auth_url = "https://accounts.spotify.com/authorize?response_type=code&client_id=" + CLIENT_ID + "&redirect_uri=" + REDIRECT_URI
    
    request.session['my_car'] = 'mini'

    return render(request, 'index.html', {'auth_url': auth_url})

def sign_in(request):
    # Get the access code returned from the GET request
    access_code = request.GET['code']
    
    # Setup the initial request to authorize the application
    data = {
        'grant_type'    : 'authorization_code',
        'code'          :  access_code,
        'redirect_uri'  :  REDIRECT_URI,
        'client_id'     :  CLIENT_ID,
        'client_secret' :  CLIENT_SECRET
    }
    headers = { "Content-Type" : "application/x-www-form-urlencoded" }
    request_url = 'https://accounts.spotify.com/api/token?' + urllib.parse.urlencode(data)

    # Make the request to Spotify for the access token and get the JSON response
    r = requests.post(request_url, data, headers)
    response = r.json()
    access_token = request.session['access_token'] = response['access_token']

    # Make a request to Spotify to information about the logged in user
    request_url = "https://api.spotify.com/v1/me"
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    # Get the user's Spotify ID and start making requests 
    user_id = request.session['user_id'] = response['id']
    request_url = "https://api.spotify.com/v1/users/" + user_id + "/playlists"
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    return render(request, 'sign_in.html', {'data': response})

def playlist(request):
    playlist_id = request.GET['id']
    user_id = request.session['user_id']
    request_url = request.GET['url'] + "/tracks"
    access_token = request.session['access_token']

    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    print(request_url)
    print(access_token)
    return render(request, 'playlist.html', {'data': response })
