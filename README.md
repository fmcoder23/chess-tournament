# Chess Tournament Management System

This is a Chess Tournament Management System built using Node.js and PostgreSQL. This project provides APIs to manage chess tournaments, players, matches, and results.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/fmcoder23/chess-tournament.git
    cd chess-tournament
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

## Configuration

1. **Create a `.env` file in the root directory and fill it with your configuration settings.**

    ```sh
    cp .env.example .env
    ```

2. **Edit the `.env` file to match your database configuration:**

    ```dotenv
    DATABASE_URL=postgresql://user:password@localhost:5432/chess_tournament
    ```

    There is a public database in the cloud already configured in the `.env.example` file with some sample data. You can use this database or change the `DATABASE_URL` to point to your own database if preferred.

## Database Setup

1. **Run Prisma migrations to set up the database schema:**

    ```sh
    npx prisma db push
    ```

## Running the Application

1. **Start the server:**

    ```sh
    npm start
    ```

2. **The server will be running at `http://localhost:<PORT>`.**

## API Documentation

API endpoints and their usage are documented in the `Chess Tournament API.postman_collection.json` file. You can import this file into Postman to explore and test the available endpoints.

## Giving and Getting Token

You should give token on headers section. To get token, send login request. 

## Sending requests as admin

Edit the user isAdmin section as true, and give the users token at headers section to use APIs as admin!


