# Default environments for testing, staging and production are included.
from girru.environments import *

# This is specific to Django projects
env.project = 'gridpak'
# You can specify environments here
# 
# def production():
#     env.hosts = [default_production_server]
#     env.path = '/var/www/erskinelabs.com'

def staging():
    env.hosts = [default_staging_server]
    env.path = '/var/www/gridpak.erskinestage.com'

# def testing():
#     env.hosts = [default_testing_server]
#     env.path = '/var/www/labs.erskinedev.com'

# Do not modify below this line
from girru.operations import *
