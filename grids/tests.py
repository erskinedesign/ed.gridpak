from django.test import TestCase
from django.core.urlresolvers import reverse
from gridpak import grids
import simplejson as json


class GridsViewsTestCase(TestCase):

    grid_fixtures = [
        {"min_width": 360, "col_num": 4, "col_width": 25,  "padding_width": 5, "padding_type": 'px', "gutter_width": 8, "gutter_type": 'px', "baseline_height": 22, "lower": 0, "upper": 500, "current": False },
        {"min_width": 600, "col_num": 8, "col_width": 12.5, "padding_width": 5, "padding_type": 'px', "gutter_width": 8, "gutter_type": 'px', "baseline_height": 22, "lower": 500, "upper": 960, "current": False },
        {"min_width": 960, "col_num": 16, "col_width": 6.25, "padding_width": 10, "padding_type": 'px', "gutter_width": 8, "gutter_type": 'px', "baseline_height": 22, "lower": 960, "upper": False, "current": True },
    ]

    def test_index(self):
        resp = self.client.get(reverse('grids_index'))
        self.assertEqual(resp.status_code, 200)

    def test_download(self):
        grids = json.dumps(self.grid_fixtures)
        post = {'grids': grids}
        resp = self.client.post(reverse('grids_download'), post)
        self.assertEqual(resp.status_code, 200)
        
        grids = 'BAD JSON'
        post = {'grids': grids}
        try:
            resp = self.client.post(reverse('grids_download'), post)
            raise ValueError
        except ValueError:
            # We WANT it to fail
            pass

