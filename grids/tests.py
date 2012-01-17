from django.test import TestCase
from django.core.urlresolvers import reverse


class GridsViewsTestCase(TestCase):

    grid_fixtures = [
        {"min_width": 100, "col_num": 4, "col_padding_width": 5, "col_padding_type": 'px', "gutter_width": 8, " gutter_type": 'px', "baseline_height": 22, "lower": 0, "upper": 500, "current": False },
        {"min_width": 500, "col_num": 8, "col_padding_width": 5, "col_padding_type": 'px', "gutter_width": 8, " gutter_type": 'px', "baseline_height": 22, "lower": 500, "upper": 960, "current": False },
        {"min_width": 960, "col_num": 16, "col_padding_width": 10, "col_padding_type": 'px', "gutter_width": 8, " gutter_type": 'px', "baseline_height": 22, "lower": 960, "upper": False, "current": True },
    ]

    def test_index(self):
        resp = self.client.get(reverse('grids_index'))
        self.assertEqual(resp.status_code, 200)

    def test_download(self):

        pass
        # resp = self.client.post(reverse('grids_download'))
