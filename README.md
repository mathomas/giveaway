# giveaway
Simple app to manage my YouTube giveaways.

The architecture is as follows:
 - Amazon Lambda back-end, using S3 as a read-only object store.  Each S3 object represents a giveaway.
 - Amazon API gateway provides the the RESTful API and generates a JS client for this code to use (not included in project).
 - Handlebars and JQuery on the front-end, along with a couple other nifty little liraries.
