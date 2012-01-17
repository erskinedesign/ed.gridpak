from django.db import models
from PIL import Image, ImageDraw
from cStringIO import StringIO

class Grid(models.Model):

    TYPE_CHOICES = (
        ('px', 'Pixel'),
        ('%', 'Percentage'),
    )

    min_width = models.IntegerField()
    col_num = models.IntegerField()
    padding_width = models.FloatField()
    padding_type = models.CharField(max_length = 2, choices = TYPE_CHOICES)
    gutter_width = models.FloatField()
    gutter_type = models.CharField(max_length = 2, choices = TYPE_CHOICES)
    upper = models.IntegerField()

    def create_image(self):
        """ Creates an image from the grid

        Creates the image as a StringIO object

        Args:
            self
        """
        # If upper is false, but this is the only grid
        if self.upper == False and self.min_width == 0:
            total_width = 960
        # If upper is false
        elif self.upper == False:
            total_width = self.min_width
        # Otherwise we can use the actual values
        else:
            total_width = self.upper - self.min_width
        # Padding occurs twice for each grid (one either side)
        total_padding = self.padding_width * (self.col_num * 2)
        # Gutter is one less than the number of cols
        total_gutter = self.gutter_width * (self.col_num - 1)
        col_width = (total_width - total_padding - total_gutter) / self.col_num
        x = 0
        image_height = 1000
        im = Image.new('RGBA', (total_width, image_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(im)
        for i in range(self.col_num):
            # Draw the left padding
            left = x
            right = x + self.padding_width
            draw.rectangle((left, 0, right, image_height), fill=(220, 75, 82, 100))
            # Move the pen along and draw the inner
            x = right
            left = x
            right = x + col_width
            draw.rectangle((left, 0, right, image_height), fill=(220, 75, 82, 65))
            # Move the pen along and draw the right padding
            x = right
            left = x
            right = x + self.padding_width
            draw.rectangle((left, 0, right, image_height), fill=(220, 75, 82, 100))
            # Move the pen along with width of the gutter
            x = right + self.gutter_width

        im_buff = StringIO()
        im.save(im_buff, "PNG");

        return im_buff
