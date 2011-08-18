Ultimate Package
================

The Ultimate Package is [Erskine Design][ed]'s framework for rapidly developing the front-end of our projects. It was initially realised by the gentleman [Gregory Wood][c1], and now lives in infamy in the pages of Andy Clark's seminal Hardboiled Web Design.

Status
======

The package is under constant development and improvement by the team at Erskine Design, who use it daily.

Developers
----------

The project is currently curated by the team at Erskine Design, including [James Willock][jw], [Wil Linssen][wl] & [Garrett Winder][gw].

[jw]: http://sleepykyoto.com
[wl]: http://wil-linssen.com
[gw]: http://garrettwinder.com

Requirements
------------

A web server to interpret the PHP files in the package, and a browser to render them.

Getting started
---------------

The package is a barebones framework to help you rapidly develop your projects. Create templates duplicated from index.php as you need them, use elements.php to check your styles. You can change the screen.css reference in _start.php to screen-prototype.css to use the experimental prototyping stylesheet.

Before you deploy to production
-------------------------------

Firstly, don't forget to remove the following files or folders:

* elements.php
* static/css/screen_prototype.png
* static/images/dev/

Then, the following are also worth considering:

* Update your humans.txt in the root directory
* Update the holding assets in /holding/

License
=======

Copyright 2011 [Erskine Design][ed].

Additional Credits
------------------

* [Greg Wood][c1] for the original Ultimate Package

[c1]: http://gregorywood.com
[ed]: http://erskinedesign.com