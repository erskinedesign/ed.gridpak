from django.shortcuts import render_to_response
#from django.http import Http404
from django.template import RequestContext
from django.conf import settings

def index(request):
    return render_to_response('gridulate/index.html', {

    }, context_instance=RequestContext(request))
