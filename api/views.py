from django.shortcuts import render
from django.http import JsonResponse
from secret import CLIENT_ID, CLIENT_SECRET

def sign_in(request):
    # Get the authorization URL from Linkedin
    RETURN_URL = "http://localhost:8000/sign_in/"
    return JsonResponse({'auth_url': 'test'})
