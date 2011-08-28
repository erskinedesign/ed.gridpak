from django.shortcuts import render_to_response
#from django.http import Http404
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import HttpRequest
from django.template import RequestContext
from django.conf import settings
from django.core.files import File
import simplejson as json
import re

def index(request):
    return render_to_response('gridulate/index.html', {
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
    file_contents = _generate_file_contents(grids)

    message = """<h1>Response</h1>
        <h2>CSS:</h2>
        <pre>""" + file_contents['css'] + """</pre>
        <h2>JavaScript</h2>
        <pre>""" + file_contents['js'] + "</pre>"

    return HttpResponse(message)


def _generate_file_contents(grids):
    """ Generates a big ol' string of CSS

    Using the template specified below, loops over the grids and builds up a
    full working css include for the media queries

    Args:
        grids: a dict of the unserialized grids from post
    Returns:
        files: a dict of files to be created
    """

    css_file = open(settings.BUILDS_DIR + 'templates/grids.css', 'r')
    js_file = open(settings.BUILDS_DIR + 'templates/grids.js', 'r')
    css = css_file.read()
    js = js_file.read()
    pattern = re.compile(r'\{grids\}(.*)\{\/grids\}', re.S)

    try:
        css_template = pattern.split(css)[1]
        js_template = pattern.split(js)[1]
    except:
        raise Exception('Poorly formatted template, do you have a {grids} tag?')

    print css_template

    for grid in grids:

        """ CSS template 
        --------------------------------------------------------------------
        """
        css += "another\n"

        """ JavaScript template 
        --------------------------------------------------------------------
        """
        js += "more js\n"

    files = {'css': css, 'js': js}

    return files


