from django.urls import path
from .views import search_suggestions

urlpatterns = [
    path('search-suggestions/', search_suggestions),
] 
