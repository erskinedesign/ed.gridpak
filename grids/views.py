from django.shortcuts import render_to_response
#from django.http import Http404
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import HttpRequest
from django.template import RequestContext
from django.template.loader import render_to_string
from django.conf import settings
from django.core.files import File
from gridpak.grids.models import Grid
import simplejson as json
import re
from cStringIO import StringIO
from zipfile import ZipFile

def index(request):
    return render_to_response('grids/index.html', {
        'cur_page': 'index',
        'debug': settings.DEBUG,
    }, context_instance=RequestContext(request))

def about(request):
    return render_to_response('grids/about.html', {
        'cur_page': 'about',
        'debug': settings.DEBUG,
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
    max_cols = 0

    # Set up a string buffer for the zip (we'll serve it from memory)
    zip_buff = StringIO()
    zip_dl = ZipFile(zip_buff, 'w')

    """ Create a PNG for each grid
    ----------------------------------------------------------------------------
    """
    for g in grids:
        # Work out which grid has the highest number of cols
        if g['col_num'] > max_cols:
            max_cols = g['col_num']
        # Instantiate a Grid model object
        grid = Grid(
            min_width = g['min_width'],
            col_num = g['col_num'],
            padding_width = g['padding_width'],
            padding_type = g['padding_type'],
            gutter_width = g['gutter_width'],
            gutter_type = g['gutter_type'],
            upper = g['upper'],
        )
        # Draw the image into a string io buffer
        im_buff = grid.create_image()
        # If upper is false, set a better name
        if g['upper'] == False:
            upper_name = 'infinity'
        else:
            upper_name = g['upper']
        # Save the grid to the zip with a decent name
        im_name = "grid-%s_to_%s.png" % (g['min_width'], upper_name)
        zip_dl.writestr(im_name, im_buff.getvalue()); 

    """ Build the zip file in memory and serve it up
    ----------------------------------------------------------------------------
    """
    # A list of the templates we want to render and add to our zip
    templates = [
        'grids/downloads/gridpak.css', 
        'grids/downloads/gridpak.js',
		'grids/downloads/gridpak.less',
		'grids/downloads/gridpak.scss',
		'grids/downloads/README.md',
    ]

    # Loop the templates list
    for template in templates:
        buff = StringIO()
        # Read the templates into string buffers
        buff.write(render_to_string(template, {
            'grids': grids,
            'max_cols': max_cols,
        }).encode('ascii', 'ignore'))

        zip_dl.writestr(template.replace('grids/downloads/', ''), buff.getvalue())

    zip_dl.close()

    response = HttpResponse(mimetype='application/zip')
    response['Content-Disposition'] = 'attachment; filename=gridpak.zip'

    zip_buff.seek(0)
    response.write(zip_buff.read())

    return response
