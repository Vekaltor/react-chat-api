# react-chat-api
API for react-chat ===> https://github.com/Vekaltor/react-chat

API working with database mongoDB, it contains services that allow user authorization (login/registration). And for connectivity to the socket.io 
server that allows real-time interactions between users.

## Technologies:
<p>Project is created with:</p>
<ul>
  <li>JavaScript (ES6)</li>
  <li>express: 4.18.2</li>
  <li>mongoose version: 6.9.3</li>
  <li>nodemailer version: 6.9.1</li>
  <li>bcrypt version: 5.1.0</li>
  <li>socket.io version: 4.6.1</li>
  <li>redis version: 4.6.5</li>
  <li>i18next version: 22.4.10</li>
  <li>Database - MONGODB />
</ul>

## Setup
To run this API, install it locally using npm:
````
$ cd ../{folder-project}

$ npm install

$ npm start
````

## Features:

### - Interalization
With i18next messages with responses are translated on correctly language.

### - Authorization
Thanks to the middleware, each request sent to the API is verified whether the user is authorized - tokens (access, refresh) are stored in httponly cookies.

### - Verification mail
It allows you to send an email to the user with the given email, with a message about the activation of the account, the link includes the expiration time.

### - Interactions between users
The API uses a socket.io server that allows users to communicate allows events such as:

#### chatting
Users can write to each other, each message is assigned to a specific room with a conversation id, also each message sent increments unread messages 
for inactive users of this conversation. It also emits an event that shows notifications about the number of unread messages for a specific user from a given conversation

In the near future:
Redis will store messages for a given conversation and cyclically save them to the database (and the user starting a given conversation will download all messages from Redis)

#### status ONLINE/OFFLINE
Broadcasts to all friends of a given user information that this user is online - similarly to disconnecting from socket.io.

Each user has access to the offline-friend and online-friend events.

The get-online-friends event, on the other hand, is used to fetch the entire online friends list from the previously uploaded friends list from the user.
