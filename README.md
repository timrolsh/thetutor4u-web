# TheTutor4U Web

A web app that connects tutors with students around the world in a timely manner.

## General Info

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

This project is built with Nextjs, which makes it easy to build a multi page web app, do page routing, do server side rendering and static page generation, all while using React. Typescript is also used in both react components and general typescript code.

### Requirements

-   Nodejs (LTS version is fine): [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

-   Yarn (package manager): Run command once nodejs is installed:

```shell

npm install --global yarn

```

### Getting Started with Development

After cloning the repository, run the following to begin working on the project:

-   run `yarn` with no args: yarn will use the yarn.lock file to download all necessary dependencies and put them in the node_modules folder

-   run `yarn dev` to launch the development environment. Anytime a change is made to any file in the file system, the environment will refresh and the page will soft reload. Nextjs will log everytime it re-compiles the page to the terminal

Eventually when putting in production, run `yarn build` and then `yarn start` to start an instance of the server

### Note about NPM/Yarn

This project uses Yarn as its package manager, please do not use NPM while working in the project, it will cause conflicts with dependencies and lead to problems running the code. Switching between the two package managers in the project will result in conflicts within the yarn.lock file. Please do not modify the yarn.lock file manually as well, the package manager takes care of all of that for you.

### Linting/Formatting

ESLint and Prettier are used for code linting, Prettier is used for code formatting and its ruled are set up in [.prettierrc.json](./.prettierrc.json). The ESLint config is set up in [.eslintrc.json](./.eslintrc.json).

### Todo

-   finish the rest of the UI

-   add authentication with auth0

-   set up the database

-   set up api to get and send data to the database (will probably do it through nextjs pages/api)
-   Containerize, set up CI/CD, deploy
