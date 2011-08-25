from django.shortcuts import render_to_response
#from django.http import Http404
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.http import HttpRequest
from django.template import RequestContext
from django.conf import settings
import simplejson as json

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

    css = ""
    js = ""

    for grid in grids:

        """ CSS template 
        --------------------------------------------------------------------
        """
        css += """
/**
 * Media query for between %d and %d
 */
@media only screen and (max-width: %d) {
    /* Add your styles here /*
}
""" % (grid['min_width'], grid['min_width'], grid['min_width'])


        """ JavaScript template 
        --------------------------------------------------------------------
        """
        js += """
/**
 * Cool guy function
 *
 * @return void
*/
var grid_toggle = function() {
    // stuff here
}
"""

    files = {'css': css, 'js': js}

    return files


