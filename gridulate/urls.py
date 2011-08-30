from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('gridpak.gridulate.views',

    url(r'^$', 'index', name='index'),
    url(r'^download/$', 'download', name='download'),

)
