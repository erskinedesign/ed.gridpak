from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('gridpak.grids.views',

    url(r'^$', 'index', name='grids_index'),
    url(r'^download/$', 'download', name='grids_download'),

)
