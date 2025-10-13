This is a charity activity website made with Node.js, Express and MySQL. The whole project is divided into two parts:
The front end uses HTML + CSS as the interface, and the back end uses Node.js to write API and interact with the database.

Home page (index.html) : The entry page that shows the activity, where you can see a general introduction and links to the project.
Activity search (search.html) : This is where users can search for activities that already exist. The back end will look it up in the database and return the result.
Activity details (details.html) : Click on an activity to see specific information, such as the activity name, category, and description.
Category management (Categors-controller.js) : The API provides the function to obtain the activity category, which is convenient for the front-end drop-down menu and so on.
Activity management (events-controller.js) : The API is responsible for adding, deleting, changing and checking activity data.

Database: charityevents_db
categories: Categories that store activities (such as health, education, community, etc.).
events: Stores specific information about the activity, including title, description, and category.
