# Dream Diaries

This is a fairly simple web app that allows users to create personal/private diaries about any dreams they've had. I built this project in order to get familiar with 
the basics of Full Stack Development, after going through FullStackOpen's course cirriculum (https://fullstackopen.com/en/)  over the summer.

The backend server provides a REST API built with Node.js (with Express), Mongoose, and Typescript, with MongoDB used as a database. User and token authentification 
is implemented using JSONWebToken and bcrypt, ensuring the security of users diaries.

The front-end was created with Create-React-App, and uses Redux Toolkit for state management, and Chakra UI for styling. Axios is used for communication for the server. If you'd like to access the frontend on it's own, it's available on it's own repository over here: 

In order to run the project locally, it's necessary to add a .env file with variables MONGODB_URI (string of your mongo uri), PORT (the local port number), and SECRET (any string, used for JWT
authentification purposes. 

It's also necessary to install the projects dependancies using "npm install". I've already created a build of the frontend (the "build" folder in the directory),
however the non-production version of the front-end is available in the /dreamdiariesfrontend/ folder. 

## Photos 
#### What the timeline looks like (composed of publically made diaries):
<img src="/forReadMe/publicTimeline.png">

#### What the modal to create a diary looks like:
<img src="/forReadMe/createDiary.png">

#### The modal for editing a diary:
<img src="/forReadMe/editDiary modal.png">

#### Users Diary List Page:
<img src="/forReadMe/usersDiaries.png">

#### The modal that shows up with the diary text itself, when you click "Read Diary" in any of the tables:
<img src="/forReadMe/readDiary modal.png">

