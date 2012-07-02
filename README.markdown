# Gridpak

Version: 0.2.7b

## The easy way to produce customisable Responsive layouts

The project is live at Gridpak.com

In your Gridpak you get

* A CSS file with your media queries, and grid points
* A LESS (.less) file that compiles down to CSS
* A SCSS (.scss) file that compiles down to CSS
* A JavaScript (.js) file that will overlay your grids at the touch of a
  button
* Some PNGs for your baseline backgrounds as well as for use in your
  designs

## Usage instructions

### Running Gridpak locally

Gridpak is a [Django][] application with a frontend controlled mostly by [Backbone.js][].

We prefer to run our Django projects using [virtualenv][], and while we won't go into detail on installing it, (you're all clever people: surely you can find a tutorial that suits you) here's the basic rundown:

1. Create the directory to house Gridpak `mkdir gridpak && cd gridpak`
1. Clone this repo into your directory, __careful to use the name gridpak__, otherwise Django will throw a hissy fit `git clone git@github.com:erskinedesign/ed.gridpak.git gridpak`
1. Start a new virtual environment `virtualenv --distribute env`
1. Activate that virtual environment `source env/bin/activate` you should then see that you're in the `env` environent in your bash
1. Install all the requisit packages `pip install -r gridpak/packages`
1. Create a `local_settings.py` file (you can copy the `local_settings.sample.txt` and it should work fine)
1. Compile the [LESS][] file so you don't get an error about not being able to find the layout stylesheets
1. You should now be able to run the app `cd gridpak && python manage.py runserver`
1. Visit the url in your browser (`http://localhost:8000` by default,) and you're away

## Feedback

We'd love feedback on the project, which you can send by email to gridpak [at] erskinedesign.com, or from the issues on this GitHub project.

<a href="https://github.com/erskinedesign/ed.ultimate_package"><img src="https://github.com/erskinedesign/ed.gridpak/raw/master/static/images/site/badge-up.png"/></a>

[Django]: http://djangoproject.com/
[Backbone.js]: /http://documentcloud.github.com/backbone/
[virtualenv]: http://pypi.python.org/pypi/virtualenv
[Less]: http://lesscss.org/
