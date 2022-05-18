# ts-express-tdd-template
A NODEJS based backend typescript project using REST with express and supertest for TDD.

This project comes preset for vscode, the included ```.vscode/launch.json``` allows for running of the app with breakpoints as well as running of mocha tests with breakpoints. 

## Cloning: 

Through CLI: 

```
git clone https://github.com/Reesy/ts-express-tdd-template
```

Graphically (this will also generate a project on your profile) 

![image](https://user-images.githubusercontent.com/5430483/159441936-843331ee-820d-4dad-af03-f1a1d31b3383.png)



## Commands:

Install: (requires node and npm)
``` npm install ```

Build: 
``` npm run build ```

Start:
``` npm run start ```

Test:
``` npm run test ```

Any tests added to the test folder will automatically be tested. 


## REST API 

### GET ```/api/v1/test1```
Example request:
```
GET /api/v1/test1 HTTP/1.1
{
    "message": "Hello!!"
}
```

Example response:
```
HTTP/1.1 200 OK
Server: My RESTful API
Content-Type: text/html; charset=utf-8
Content-Length: xy

"Hello World!" 
```
---

### POST ```/api/v1/test1```
Example request:
```
POST /api/v1/test1 HTTP/1.1
Accept: application/json
Content-Type: application/json
Content-Length: xy

{
    "message": "Hello!!"
}
```
Example response:
```
HTTP/1.1 200 OK
Server: My RESTful API
Content-Type: text/html; charset=utf-8
Content-Length: xy

"The body was: Hello!!" 

```
---
