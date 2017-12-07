from django.conf.urls import url

from . import views

app_name = 'api'
urlpatterns = [
    url(r'^api/$', views.index, name='index'),
    url(r'^api/me', views.me, name='me'),
    url(r'^api/playlists', views.playlists, name='playlists')
]