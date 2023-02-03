# TownBoard
TownBoard: An internal social application to enable employees to share mini blogs about their work projects &amp; achievements with others.

## Technologies utilized
**Built with**: Built with Node.js, Express.js, MongoDB, GoogleAuth, Handlebars, CSS + MaterializeCSS

Front-end:<br>
TownBoard's front-end is writtern in HTML, CSS, and JavaScript with Handlebars as the templating languange and Materialize as the styling framework. The user interface functionalities that interact with the APIs in the back-end is written in JavaScript.

Back-end:<br>
The back-end logic is written in JavaScript and runs on NodeJS. The MVC architectural pattern was utilized in the designing the back-end structure. Authentication is handled by GoogleAuth, removing the need to create a new account within the app. A private posting functionality was impletemented to allow users to submit posts that can only be viewed by the user who submitted the post (abstraction of selected user posts). Data generated by users are stored in a MongoDB database.


## Future Optimizations
1) Add an upload photo functionality
2) Add alternative authentication service
3) Migrate to a modern front-end framework e.g. React, Angular, etc.
