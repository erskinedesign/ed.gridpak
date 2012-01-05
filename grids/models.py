from django.db import models
from PIL import Image, ImageDraw
from StringIO import StringIO

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
        print "Upper: %s Min width: %s" % (self.upper, self.min_width)
        if self.upper == False and self.min_width == 0:
            total_width = 960
        elif self.upper == False:
            total_width = self.min_width
        else:
            total_width = self.upper - self.min_width
        total_padding = self.padding_width * (self.col_num * 2)
        total_gutter = self.gutter_width * (self.col_num - 1)
        col_width = (total_width - total_padding - total_gutter) / self.col_num
        print "%d = %d - %d - %d" %(col_width, total_width, total_padding, total_gutter)
        x = 0
        im = Image.new('RGBA', (total_width, 20), (0, 0, 0, 0))
        draw = ImageDraw.Draw(im)
        for i in range(self.col_num):
            left = x
            right = x + self.padding_width
            draw.rectangle((left, 0, right, 20), fill=(220, 75, 82, 100))
            x = right
            left = x
            right = x + col_width
            draw.rectangle((left, 0, right, 20), fill=(220, 75, 82, 65))
            x = right
            left = x
            right = x + self.padding_width
            draw.rectangle((left, 0, right, 20), fill=(220, 75, 82, 100))
            x = right + self.gutter_width

        im_buff = StringIO()
        im.save(im_buff, "PNG");

        return im_buff
