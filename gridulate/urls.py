from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('gridulator.gridulate.views',

    url(r'^$', 'index', name='index'),

)
