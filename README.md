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
* Add context for government policy, rationale for relocating people living in informal housing
  * Most new social housing is in "new cities"
* Consider language of "informal communities" vs. "slums"
  * Rationale for using the language is that this is the terminology used by the government
* Visual ideas
  * Emphasize walk over highway, danger/challenges that it brings (e.g. background intro video of crossing)

