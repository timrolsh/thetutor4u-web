# TheTutor4U Web

A web app that connects tutors with students around the world in a timely manner.

## App Idea/General Info

### **Instant Tutoring**

#### **Students:**

Log onto the website at any point in time throughout the day, find a subject that you would like to be tutored in, and soon, you will be matched with a tutor, begin a quick "intro" session, where you'll be able to see the tutor's price per hour, and find out if you like them or not. This session will last for 5 minutes. If you do not like them, you can skip them at any point during the intro session and the website will match you with another tutor. Once both the student and the tutor agrees to start the session, the clock starts running. The session will end if either the tutor or the student leaves or drops out of the call, or if the money on the student's balance runs out.

#### **Tutors:**

First, you have to be approved to teach in specific subjects. If you would like to add a new subject to teach, you can do that too, that subject will be approved, and you will be approved to teach it. Log on to the website at any point in time throughout the day, where you can pick a subject or multiple subjects that you are ready to teach at this moment, set prices for each subject or set them the same for all subjects and go online. You will then be matched with a student from any one of those subjects, where you can begin the five-minute intro session. Here, you can adjust the rate per hour, and view ratings and reviews about the student from other tutors. Then, the student will approve, and you can begin the session.

### **Scheduled Tutoring**

#### **Students:**

If you like a tutor that you were matched with, you can follow them after the session, and schedule future meetings with them, and negotiate a time period and a rate ahead of time. You as the student then pay the entire fee for the entire time up front, and when the time comes, you enter your scheduled meeting with your tutor. Both students and tutors will have a calendar page, where they can see their upcoming meetings.

#### **Tutors:**

Students may request scheduled sessions, which you can accept. The student gives you a certain amount of time, and you give them a price per hour and you guys can negotiate the price. The student pays up front, and then the session begins at the scheduled time. You may cancel the session before, and the student will be refunded the full amount. You can cancel the session during, and the student will be refunded the amount of time that you were unable to continue the session for.

### **Payment System**

Every user has a "balance". Any user can add to their balance using payment methods such as credit card, PayPal, or bank transfer. That balance is then used for all transactions on the website. Meetings with tutors. A user can pull money out of their balance through PayPal or bank.

## Technical Info

### **Project Tools/Requirements**

-   Express
-   EJS (server side rendering, html templating)
-   PostgeSQL (relational database, for now)
    **Node, docker, and yarn need to be manually installed. Node and docker make it possible to use all the other tools in the project**

-   Node (js runtime)
    -   **Download:** (LTS version is fine): [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
-   Yarn (project package manager):
    -   Install will only work once node is installed. Run the following command: `npm install --global yarn`
-   Docker (only running postgres for now)
    -   **Download:** [https://docs.docker.com/desktop/install/windows-install/](https://docs.docker.com/desktop/install/windows-install/)

### **Development Enviornment Setup**

-   clone the repository
-   run `yarn` with no args. The package manager will download and install all the necessary dependencies for this project and put them in the node_modules folder
-   run `yarn dev` to launch the development environment. Anytime a change is made to any file in the file system, the environment will restart the server.

**Enviornment Varibales**

-   a .env file is needed for the application to start, create a new one and use the following fields:

```
DEV=true
PORT=80
PGUSER="root"
PGHOST="localhost"
PGDATABASE="postgres"
PGPASSWORD="root"
PGPORT=5432
GOOGLE_CLIENT_ID="240249167376-5b49a6dja4hb007kamoomptlev3a2sq4.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
```

-   dev set to true turns on the morgan logger which logs all requests to the server, port specifies the port the server will run on, the PG fields correspond to the data in the docker container
-   I created a google authentication app on their google authentication console. Using mine is fine, but if you need to make your own with its own client id and secret, make one on [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) and update the enviornment variables.

**Getting started with the database**

You can host a "development database", a database with some sample data for development purposes. Data changed inside of here will not affect the actual database.

-   cd into the [db](./db/) folder

-   make sure docker desktop is running on your computer

-   build an image from the Dockerfile using the following command: `docker build -t "thetutor4u-db-image" .`

-   Launch the image and expose it to the host computer on the postgres default post, 5432, with the following command: `docker run --name thetutor4u-db -d -p 5432:5432 thetutor4u-db-image`

-   Populate the new empty database with the data schema and the sample data by running the following command: `docker exec thetutor4u-db psql -d postgres -f /script/init_db.sql;`
-   Note: If changes are made to the [db/init_db.sql](db/init_db.sql) file, the container and image must be deleted. This can be done with the Docker Desktop app.

### Note about NPM/Yarn

This project uses Yarn as its package manager, please do not use NPM while working in the project, it will cause conflicts with dependencies and lead to problems running the code. Switching between the two package managers in the project will result in conflicts within the yarn.lock file. Please do not modify the yarn.lock file manually as well, the package manager takes care of all of that for you.
