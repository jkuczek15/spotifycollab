from secret import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
import requests
import urllib

##########################
#     Authentication     #
##########################
def get_access_token(access_code):
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

    if(response.get('error') != None):
        # This is an invalid authorization code
        return 'expired'

    return response.get('access_token')

def get_user_id(access_token):
    # Make a request to Spotify to information about the logged in user
    request_url = "https://api.spotify.com/v1/me"
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    if(response.get('error') != None):
        # Access token is expired
        return 'expired'

    return response.get('id')

##########################
#       Playlists        #
##########################
def get_playlists(user_id, access_token):
    request_url = "https://api.spotify.com/v1/users/" + user_id + "/playlists"
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    if(response.get('error') != None):
        # Access token is expired
        return 'expired'

    return response

def get_tracks(playlist_url, access_token):
    request_url = playlist_url + "/tracks"
    r = requests.get(request_url, headers={ "Authorization" : "Bearer " + access_token })
    response = r.json()

    if(response.get('error') != None):
        # Access token is expired
        return 'expired'

    return response


