from django.template import Library

register = Library()

# This is a bit rank, found on Djangosnippets.

numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
           'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
           'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eightteen',
           'nineteen',]

_first_ten = numbers[1:10]

for decimal in ['twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy',
                'eighty', 'ninety']:
    numbers.append(decimal)
    numbers.extend(decimal + "-" + num for num in _first_ten)

@register.filter
def cssnumber(num):
    """like humanize appnum but goes the full gambit from 0 to 99.
    Is not translated as this is intended for CSS use.
    0 : zero
    10: ten
    45: fourty-five

    use the filter tag if you want a translation...
    """
    return numbers[num]
    
@register.filter
def get_range(value):
  """
    Filter - returns a list containing range made from given value
    Usage (in template):

    <ul>{% for i in 3|get_range %}
      <li>{{ i }}. Do something</li>
    {% endfor %}</ul>

    Results with the HTML:
    <ul>
      <li>0. Do something</li>
      <li>1. Do something</li>
      <li>2. Do something</li>
    </ul>

    Instead of 3 one may use the variable set in the views
  """
  return range(value)

@register.filter
def mult(value, arg):
    "Multiplies the arg and the value"
    return int(value) * int(arg)

@register.filter    
def div(value, arg):
    "Divides the value by the arg"
    return int(value) / int(arg)