from django.conf.urls import url

from . import views

app_name = 'home'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^sign_in/', views.sign_in, name='sign_in'),
    url(r'^playlist/', views.playlist, name='sign_in')
]