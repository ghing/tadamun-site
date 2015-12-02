tadamun-site
============

Microsite about the relocation of former residents of the  Stabl Antar neighborhood in Cairo, Egypt.  Built as part of the [Data4Chan.ge Beirut Edition workshop](http://data4chan.ge/).

Assumptions
-----------

* Node
* Gulp

Installation
------------

Clone the repository:

    git clone https://github.com/ghing/tadamun-site.git

Install build dependencies:

    cd tadamun-site
    npm install

Generating the site
-------------------

The site can be regenerated in the `build` subdirectory using `gulp`:

    gulp


To do
-----

* Static map, content changes as user scrolls
* Render map elements from data using D3
* Map tiles from tile service
* Animate drawing of distance line in first section
