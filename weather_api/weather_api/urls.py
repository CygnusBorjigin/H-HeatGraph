from logging import root
from django.contrib import admin
from django.urls import path, include

from django.http import HttpResponse

def rootPath(request):
    return HttpResponse('The server is working')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', rootPath),
    path('base/', include('base.urls'))
]
