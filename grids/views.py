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
    templates = _generate_file_contents(grids)

    """ Build the zip file in memory and serve it up
    ----------------------------------------------------------------------------
    """
    buffer = StringIO()
    zip = ZipFile(buffer, 'a')

    zip.writestr('ed_grids.css', str(templates['css'].decode('utf-8')))
    zip.writestr('ed_grids.js', str(templates['js']))

    # fix for Linux zip files read in Windows
    for file in zip.filelist:
        file.create_system = 0

    zip.close()

    response = HttpResponse(mimetype='application/zip')
    response['Content-Disposition'] = 'attachment; filename=ed_grids.zip'

    buffer.seek(0)
    response.write(buffer.read())

    return response


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
    pattern = r'\{grids\:loop\}(.*?)\{\/grids\:loop\}';

    css_template = css_file.read()
    js_template = js_file.read()

    css_loops = re.findall(pattern, css_template, re.S)
    js_loops = re.findall(pattern, js_template, re.S)

    if len(css_loops) < 1 or len(js_loops) < 1:
        raise Exception('Poorly formatted template(s), do you have a {grids:loop} tag?')

    for loop in css_loops:

        grid_count = 0
        r = ''

        for grid in grids:

            grid_count = grid_count + 1

            """ CSS template 
            --------------------------------------------------------------------
            """
            css_r = _replace_vals(grid, loop)
            # also add our own one's we've made herein
            css_r = css_r.replace('{{ count }}', str(grid_count))

            r += css_r

        # css_template = pattern.sub(css_template, r, 1)
        css_template = re.sub(pattern, r, css_template, 1, re.S)

    for loop in js_loops:

        grid_count = 0
        r = ''

        for grid in grids:

            grid_count += 1

            """ JavaScript template 
            --------------------------------------------------------------------
            """
            js_r = _replace_vals(grid, loop)
            # also add our own one's we've made herein
            js_r = js_r.replace('{{ count }}', str(grid_count))

            r += js_r

        js_template = re.sub(pattern, r, js_template, 1, re.S)

    files = {'css': css_template, 'js': js_template}
    return files

def _replace_vals(key_val, string):
    """ Replace the vars in the string with those in grid

    Loops over the grid key => val and replaces {{ key }} with val in the
    string

    Args:
        key_vals: a dict of the keys and vals we're going to replace
    Returns:
        string: the value replaced string
    """
    r = string

    for key, val in key_val.items():
        # replace all string vars by {{ key }} = var
        for key, val in key_val.items():
            if val:
                r = r.replace('{{ ' + key + ' }}', str(val))

    return r

