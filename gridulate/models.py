from django.db import models

# Create your models here.
class Grid(models.Model):
    min_width = models.IntegerField()
    col_num = models.IntegerField()
    col_width = models.IntegerField()
    col_width_type = models.CharField(max_length=2)
