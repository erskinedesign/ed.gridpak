from django.db import models

# Create your models here.
class Grid(models.Model):
    lowest_width = models.IntegerField()
    col_num = models.IntegerField()
    col_width = models.IntegerField()
    col_width_type = CharField(max_length=2)
