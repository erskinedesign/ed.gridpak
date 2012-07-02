# Gridpak

Gridpak is an interactive tool for creating responsive grid layouts.
Each Gridpak is a collection of at least five files:

* A CSS file with all the classes and properties you need to create a responsive grid layout.
* A LESS file with much the same information but including variables, mixins and methods to help you.
* An SCSS file like the LESS file, but in SCSS.
* A semi transparent PNG image for each grid you have created to help with your design, or with lining things up in your front end.
* A javascript snippet that allows you to toggle an overlay of your grid on and off in any browser using the 'G' key.  

## Using the application

When you arrive at [Gridpak.com](http://gridpak.com/) you will be
greeted by a single grid with some default options. You can then start
to drag things around and update numbers as required.

### Adjusting the grid

When you drag the browser's toolbar left and right you'll see your grid shift and adjust and where things may break or
become too stretched or condensed.

As you update the number of columns, column padding and gutter width you
will see your grid changing in real time. Again, you can drag the
browser's toolbar to see how it feels at different widths.

### Adding several grids

You might decide that you want to have one grid that works on viewports
up to 700px wide, but below that the columns are just too condensed. You
can add another grid, with separate properties add that break point.

Drag the browser toolbar to 700px (it's width is denoted in the bottom
right of the browser) then click 'Add break point'. You've now set the current grid's minimum width at 700px.

If you drag the browser toolbar to the left, you'll now be editing a
separate grid - one that you can adjust to better fit a smaller
viewport.

### Downloading your grids

When you are finished, just click 'Download your Gridpak' and the CSS,
JavaScript and images will be constructed and served up in a convenient ZIP file.

## Using the Gridpak in a project

This part is really up to you, but we have some suggestions to make
the most of the files.

### PNGs

The PNGs will hopefully be useful as a reference for you when designing,
and / or when implementing front-end to ensure things line up.

### CSS, LESS & SCSS

When using these files, if you are using more than one grid it's
probably a good idea to use the naming conventions as a reference only.
If for example you use the class name 'span_6' on an item, but then a
lower media query means you only have three columns, you'll be in
trouble.

Our suggestion would be to use semantic naming conventions in your
markup, perhaps like this:

    <div class="row">
        <ul class="item_listing">
            <li class="col item">
                <p>This is my item, there are many others like it but this one is mine.</p>
            </li>
            <li class="col item">
                <p>This is my item, there are many others like it but this one is mine.</p>
            </li>
            <li class="col item">
                <p>This is my item, there are many others like it but this one is mine.</p>
            </li>
        </ul> <!-- // .item_listing -->
    </div> <!-- // .row -->

Then in the CSS file, we can add those classnames right where we want
them, so they always make sense in the grid and in the CSS. Let's say we
have a Gridpak with 2 grids, one with 16 columns and a min-width of 800
and another with 3 columns at a min-width of 0 and max-width of 799:

    ...
    .span_1 {
        width:15.0%;
    }
    .span_2 {
        width:32.0%;
    }
    .span_3,
    item_listing .item {
        width:49.0%;
    }

All we've done is pop an extra selector in next to the items that
correspond, and we're not tied to a potentially incorrect naming scheme.

### JavaScript

We would suggest you only use the JavaScript in your development
environment, since you should only ever need it when you are building.

Pop in the following code, just before the closing body tag. If you're
not including jQuery already, it will do that for you.

    <script src="//path/to/gridpak.js"></script>

The JavaScript will then build reference grids on top of your markup and
let you _toggle them on and off by pressing G_. The media queries will
work too, so as you change the width of your viewport, the grids will
update too.

## Contributing

This is a beta, not finished the finished article and we plan to add many features over the coming weeks and months. We would very much like your input, so please get in touch with any suggestions or comments. 

We have a [Trello board](https://trello.com/board/gridpak/4ec2949a6f575b8735025392)
set up where you can vote on features we are choosing to develop or just
keep track of what we have planned.

Of course, if you don't see what you're looking for please just drop us
a line at gridpak [at] erskinedesign.com. or on Twitter @Gridpak
