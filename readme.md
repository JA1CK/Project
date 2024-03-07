# Project README

# Team Name: ReactRangers
# Team Members: Jainish Patel, Aditya Joshi, Param Gandhi

Welcome to the ReactRanger's Server Project repository! This repository contains the source code for a web application built with Node.js and Express.js. This application provides functionalities for managing restaurants, menus, user registration, and authentication. Below is a brief overview of the project structure, functionality, and assigned tasks:

## Project Structure

- **index.js**: Entry point of the application. Initializes the Express server and sets up routes.
- **routes**: Contains route definitions for various functionalities such as user, restaurant, menu, and admin operations.
- **models**: Defines Mongoose schemas for User and Restaurant entities.
- **middlewares**: Contains middleware functions for authentication and authorization.
- **config**: Configuration files, including database configuration and environment variables.
- **database.js**: Handles database operations using Mongoose ORM.
- **public**: Contains static assets such as CSS, JavaScript, and images.

## How to Run

1. Make sure you have Node.js and MongoDB installed on your machine.
2. Clone this repository to your local machine.
3. Install dependencies using `npm install`.
4. Set up your environment variables by creating a `.env` file and providing values for `TOKEN` and `DB_URL`.
5. Run the application using `node index.js`.

## Functionality Overview

- **User Management**: Allows users to register, login, and logout. Implements token-based authentication and authorization.
- **Restaurant Management**: Enables CRUD operations for restaurants, including adding, updating, deleting, and viewing restaurants. Supports sorting and pagination.
- **Menu Management**: Provides functionalities to manage menus for restaurants, including adding, updating, deleting, and viewing menu items.
- **Admin Operations**: Admins can view all users and approve user registrations.

## Work Assignments

1. **Aditya Joshi**:
   - **Task**: Login & signup (frontend and backend with proper Authentication)
   - **Responsibilities**:
     - Design and implement the user interface for login/signup.
     - Develop backend API endpoints for user registration and authentication.

2. **Jainish Patel**:
   - **Task**: Restaurant & Menu functionality (both frontend and backend)
   - **Responsibilities**:
     - Design the user interface for displaying restaurant listings and menus.
     - Develop backend logic to fetch and serve restaurant data and menu data to the frontend.

3. **Param Gandhi**:
   - **Task**: Cart System and Checkout Page (both frontend and backend)
   - **Responsibilities**:
     - Design and implement the cart interface for smooth user experience.
     - Develop backend functionality to handle cart operations such as adding and removing items.
     - Design and implement frontend/backend for the checkout page with a focus on user interaction.

## Technologies Used

- **Node.js**: Runtime environment for server-side JavaScript.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM library for MongoDB, used for data modeling and database operations.

Thank you! If you have any questions or need further assistance, please don't hesitate to reach out.
