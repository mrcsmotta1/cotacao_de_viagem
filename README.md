# cotacao_de_viagem

## Travel registration, developed in Node and docker

## Requirements

- [docker >= 19.03.12](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)

### Test Requirements

- [node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/get-npm)

## Quick Start

- Clone or download this repository
- Go inside of directory, `cd cotacao_de_viagem`
- Run this command `make up`

## Environments

This Compose file contains the following environment variables:

- `SERVER_PORT` the default value is **5000**

## Access to CSV

- `cd cotacao_de_viagem/backend/src/csv`
- `routes.csv`

## Api Interface

### Routes

- [Swagger](http://localhost:5000/api-docs/)

### Postman

- [Postman](https://documenter.getpostman.com/view/2333553/T1LQhmGC)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3bb75224782259c006f0)

### Note:

> **Run test**

- `cd /cotacao_de_viagem/backend`
- `npm test`
