from django.shortcuts import render
from django.http import HttpResponse

def home(requests):
    return HttpResponse("this is base / home")
    
