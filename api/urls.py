from django.conf.urls import url

from . import views

app_name = 'api'
urlpatterns = [
    url(r'^sign_in/', views.sign_in, name='sign_in')
]