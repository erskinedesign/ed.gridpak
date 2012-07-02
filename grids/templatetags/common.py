from django.template import Library

register = Library()

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
  return range(1, value)

@register.filter
def mult(value, arg):
    "Multiplies the arg and the value"
    return float(value) * float(arg)

@register.filter
def div(value, arg):
    "Divides the value by the arg"
    return float(value) / float(arg)

@register.filter
def span_width(grid, span):
    """
    Returns the col width by how many it's spanning

    {{ grid|col_width:3 }}
    """
    if (grid['gutter_type'] == '%'):
        gutter_pc = float(grid['gutter_width'])
    else:
        gutter_pc = 0
    span = (grid['col_width'] * int(span)) + (gutter_pc * (int(span) - 1))
    return span
