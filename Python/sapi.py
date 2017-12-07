from secret import INIT_REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
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
        'redirect_uri'  :  INIT_REDIRECT_URI,
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


