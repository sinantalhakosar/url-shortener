# URLSHORTENER

UrlShortener is a project library for taking a long complicated URL and compacting it into a short, neat link for you to share.

Combination of PostgreSQL and Javascript including SequelizeJS, ExpressJS and HandleBars.
## Installation

Please make sure that you have installed [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable), [PostgreSQL](https://www.postgresqltutorial.com/install-postgresql/). You can check how to install them by clicking on them.

1- Configure DB as follows or do not forget to change db.config.js as requested:

For use:
```json
HOST: "localhost",
USER: "sinan",
PASSWORD: "kosar",
DB: "urlshortener",
```
For testing:
```json
HOST: "localhost",
USER: "sinan",
PASSWORD: "kosar",
DB: "urlshortener_test",
```

2- Clone this project and type
```bash
yarn
```
inside the root path, it will install the dependencies for the project automatically.

3-Type:
```bash
yarn start
```
To start the project, which creates tables and relations and serve the project on localhost:3000 if it is available.

4- Project is ready to use, to understand the written code please check the comments in the code.

## Additonal Notes

If you want to build project inside a server please check auth.config.js file, remove this file and write secret to .env file in the project and change imports.

## Owner
[Sinan Talha Kosar](https://sinantalhakosar.github.io)

## License
[MIT](https://choosealicense.com/licenses/mit/)