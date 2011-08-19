from django import forms

class GridForm(forms.Form):

    COL_TYPE_CHOICES = (
        ('px', 'Pixels'),
        ('%', 'Percentage'),
    )

    min_width = forms.IntegerField(label='Minimum width')
    col_num = forms.IntegerField(label='Number of columns')
    col_width = forms.IntegerField(label='Column width')
    col_width_type = forms.ChoiceField(choices=COL_TYPE_CHOICES, widget=forms.Select, label='PX or %')
