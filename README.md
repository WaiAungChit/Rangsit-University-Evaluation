
# Rangsit University Staff Evaluation

Creating a dynamic backend system with Express.js and MongoDB to facilitate staff evaluations at Rangsit University.
## Introduction

Welcome to the Rangsit University Staff Evaluation Backend repository! Our project is built using Express.js and MongoDB to facilitate staff evaluations at Rangsit University. Administrators can efficiently manage user accounts, oversee voting processes, and handle various administrative tasks with ease. Our goal is to provide a reliable and user-friendly platform that enhances the efficiency and transparency of staff evaluations. Join us as we work to streamline the evaluation process and support the growth and development of the university community.






## Usage
### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```
### Configuration
Set up environment variables as specified in the .env.example file.

### Starting the Server
To start the server, run the following command:

```bash
nodemon app.js
```
Ensure you have configured the environment variables before starting the server.

## Routes
### Admin Routes:

Login: POST request to /login with admin credentials to log in.

Signup: POST request to /signup to create a new admin account.

Delete Admin: DELETE request to /delete-admin to remove an admin account.

### Manage Users:

Create User: POST request to /users to create a new user.

Get All Users: GET request to /users to retrieve a list of all users.

Delete User: DELETE request to /users/:userId to delete a user.

Update Profile Picture: PUT request to /users/:userId to update a user's profile picture.

Get All Votes: GET request to /votes to fetch all submitted votes.

Change Password: PUT request to /change-password to modify the admin password.

Forgot Password: POST request to /forgot-password to initiate a password reset.

Update Vote Limit: PUT request to /update-vote-limit to adjust the vote limit.

User Routes:

Get All Users Except Current: GET request to /:userId to retrieve information about all users except the currently logged-in user.
Vote Routes:

Submit a Vote: POST request to / to submit a vote in the staff evaluation process.




