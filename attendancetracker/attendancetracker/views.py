from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status


def home(req):
    return HttpResponse("<h1 style='background-color: black; color:red'>Hello this is Home page of our Application</h1>")

def about(req):
    return HttpResponse("Hello this is Aboiut page of our Application")

def index(req):
    return render(req,"index.html")  


#Api to get User by token
@api_view(['POST'])
@permission_classes([AllowAny])
def get_user_from_token(request):
    token_key = request.data.get('token')

    if not token_key:
        return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = Token.objects.get(key=token_key)
        user = token.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }, status=status.HTTP_200_OK)

    except Token.DoesNotExist:
        return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)


