# NodeJS Authentication

> This repository contains code to add basic authentication to your app. The code here works independent of any frontend framework. The only thing that is required is postgres database. Postman app was used to send request to routes.

## Authentication:

1. passport-local branch contains code to add authentication using sessions.
2. passport-jwt branch contains code to add authentication using jwt with passport library.
3. custom-jwt branch contains code to add authentication using jwt without passport library. jsonwebtoken library is used here.

There is another branch which only explores the concepts behind JWT and cryptography.

## Usage:

> Usage requires nothing special, just nodejs with express. This repo is meant to be used as starter files only. It does not contain plug and play code. Changes need to be made to postgres file for creating better models for production.

## Libraries:

- passport
- passport-jwt
- express
- express-session
- jsonwebtoken
- crypto
- sequelize (to create Database models)

