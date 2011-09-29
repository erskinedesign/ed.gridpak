from django.test import TestCase
from django.core.urlresolvers import reverse


class GridsViewsTestCase(TestCase):

    def test_index(self):
        resp = self.client.get(reverse('grids_index'))
        self.assertEqual(resp.status_code, 200)
