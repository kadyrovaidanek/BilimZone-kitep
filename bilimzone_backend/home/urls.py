from django.urls import path
from .views import home_data

urlpatterns = [
    path("home/", home_data, name="home-data"),
]