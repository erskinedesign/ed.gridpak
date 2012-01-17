from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import Http404
from django.conf import settings
from datetime import datetime 
import os

def static_page(request, page):
    if len(page) == 0:
        page = 'index'
    elif page[-1] == '/':
        page = page + 'index'

    page = page + '.html'

    template = None

    for template_dir in settings.TEMPLATE_DIRS:
        temp = template_dir + page
        if os.path.exists(temp):
            template = temp

    if settings.DEBUG:
        debug = 'true'
    else:
        debug = 'false'

    if template is not None:
        return render_to_response(page,
            {
                'now': datetime.now(),
                'debug': debug,
            },
            context_instance = RequestContext(request)
        )

    raise Http404
