from django.shortcuts import render_to_response
#from django.http import Http404
from django.template import RequestContext
from django.conf import settings
from forms import GridForm

def index(request):
    grid_form = GridForm(request.POST),
    return render_to_response('gridulate/index.html', {
        'grid_form':  grid_form,
    }, context_instance=RequestContext(request))
