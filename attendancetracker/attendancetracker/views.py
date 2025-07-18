from django.http import HttpResponse
from django.shortcuts import render

def home(req):
    return HttpResponse("<h1 style='background-color: black; color:red'>Hello this is Home page of our Application</h1>")

def about(req):
    return HttpResponse("Hello this is Aboiut page of our Application")

def index(req):
    return render(req,"index.html")    
