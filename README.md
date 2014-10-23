# The Gradebook
### Developed by Danny Francken
#### Coding Exercise for LogRhythm

#### Live App (Mobile Friendly): http://logrhythm-31086.onmodulus.net/ 
========
## About

The app was developed to give teachers a responsive interface to better keep track of their student's scores and see the stats in real time.

#### How it Works

##### Backend
I set up a MongoDB collection on MongoLab in order to maintain persistant storage for the app across all devices. Node.js with the express framework setup the server and handles all the backend traffic and routing. The app didn't rely too heavily on the backend since most of the action was on the front end. I set up a controller and route on the backend for the student endpoint, which allows for the CRUD operations.

##### Front-end
On the front-end, I'm using ui-router's resolve method and a custom service I set up in order to make a GET request to the backend. The reason I use the resolve method is so we have all the student data loaded before we call the controller and render the page, so there is no period when the controller has no data.

##### Separation of Concern
In order to maintain the practice of separation of concern, I have a service for any requests (GET, PUT, POST and DELETE). The controller handles the actions and validation on the page. Finally a custom directive (focusOn) was used in order to keep any DOM manipulation out of the controller. 

##### Validation
To handle user validation, I set up a function to check the grade and another one to check the name. The respective function is called when the user hits enter, or clicks away (ng-blur). Once the user has entered a valid grade and name, we call the service to either update or add the student. 

##### Graph Display
I wanted to have a visual to display the grade summary and I thought a SVG graph would be perfect. I went with Chartist, which is a javascript library that provides developers with multiple options for creating responsive graphs. Unfortunately, when scaled down, the labels on the x-axis can get a little crowded, so I had to trim down the names to the first 2 letters. 

##### Promises
Promises are used with these service calls, so once the backend sends the response, the service's callback gets called, which then resolves the promises in the controller, meaning the data is ready and we can update the scope. 

##### Responsive Design
Twitter bootstrap was used from the start, so all the elements take advantage of Bootstraps resposive approach. I went with col-sm in order to optimize it for smaller devices.

##### Hosting
I am using Mongolab to host the database, and all the code is hosted on Modulus.io, which provides an interface to run and monitor Node.js applications.

##### File Management
Bower is used in order to manage any packages, such as bootstrap, font-awesome for several icons, angular-bootstrap, ui-router and angular.js



