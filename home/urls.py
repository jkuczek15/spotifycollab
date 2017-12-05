from django.conf.urls import url

from . import views

app_name = 'home'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^landing/', views.landing, name='landing'),
    url(r'^playlist/', views.playlist, name='playlist')
]