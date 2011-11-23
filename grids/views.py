from django.shortcuts import render_to_response
#from django.http import Http404
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import HttpRequest
from django.template import RequestContext
from django.template.loader import render_to_string
from django.conf import settings
from django.core.files import File
import simplejson as json
import re
from StringIO import StringIO
from zipfile import ZipFile

def index(request):
    return render_to_response('grids/index.html', {
        'cur_page': 'index',
    }, context_instance=RequestContext(request))

def about(request):
    return render_to_response('grids/about.html', {
        'cur_page': 'about',
    }, context_instance=RequestContext(request))

def download(request):
    """ Preps the download from the form post and delivers it

    Uses the JSON encoded grids and loops over them building the css, js and
    images required for all to work correctly

    Args:
        request
    """
    # redirect if it's not a post
    if request.method != 'POST':
        return HttpResponseRedirect('/')

    grids = json.loads(request.POST['grids'])

    """ Build the zip file in memory and serve it up
    ----------------------------------------------------------------------------
    """
    # Set up a string buffer for the zip (we'll serve it from memory)
    zip_buff = StringIO()
    # A list of the templates we want to render and add to our zip
    templates = [
        'ed_grids/ed_grids.css', 
        'ed_grids/ed_grids.js',
    ]
    # Set up a zipfile in the zip buffer that we'll write to
    zip_dl = ZipFile(zip_buff, 'w')

    # Loop the templates list
    for template in templates:
        buff = StringIO()
        # Read the templates into string buffers
        buff.write(render_to_string(template, {
            'cur_page': 'index',
        }).encode('ascii', 'ignore'))

        zip_dl.writestr(template, buff.getvalue())

    zip_dl.close()

    response = HttpResponse(mimetype='application/zip')
    response['Content-Disposition'] = 'attachment; filename=ed_grids.zip'

    zip_buff.seek(0)
    response.write(zip_buff.read())

    return response
