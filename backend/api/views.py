from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def search_suggestions(request):
    suggestions = [
        "iphone",
        "samsung",
        "macbook",
        "rtx 4070",
        "logitech",
        "monitor"
    ]

    return Response(suggestions) 
    