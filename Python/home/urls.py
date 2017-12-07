from django.conf.urls import url

from . import views

app_name = 'home'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^landing/', views.landing, name='landing'),
    url(r'^main/', views.main, name='main'),
    url(r'^host/', views.host, name='host'),
    url(r'^join/', views.join, name='join'),
    url(r'^playlist/', views.playlist, name='playlist')
]