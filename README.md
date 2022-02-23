# record-selector
## Author: Abhijit Baldawa

### Description
A NodeJS/Typescript based server which fetches records from mongo DB.

### Public API for testing
POST http://ec2-54-85-181-78.compute-1.amazonaws.com:3000/records/filter
Enter for ex. below body with POST request
```typescript
{
    "startDate": "2016-01-26",
    "endDate": "2018-02-02",
    "minCount": 800,
    "maxCount": 3000
}
```

### Tech stack
1. **Backend:** Node.js(16.14.0 LTS)/Typescript, express.js, mongoose.js.
2. **Database** Mongo DB
3. **Testing modules used:** Jest (and supertest for integration tests)
4. **Linters and formatters:** Eslint, prettier
5. **Container:** Docker

#### NOTE: Extensive tests are written. Unit tests are written inside `__tests__` folder and integration tests are inside ``tests/integration`` folder.

### How to run the server:
**a] With Docker**
1. **git clone https://github.com/abaldawa/record-selector.git**
2. **cd record-selector**
3. **IMPORTANT:** Open docker-compose.yml file and for env variable MONGODB_URL enter the URL to connect to mongo DB
4. **docker-compose up**
5. The http server will start running on port **3000**

**b] Without docker**

**Note: Node.js 16.14.0 (or above) must be installed**
1. **git clone https://github.com/abaldawa/record-selector.git**
2. **cd record-selector/server**
3. execute "**npm i**" in the terminal path to install node modules
4. **cp .env.example .env**
5. Execute "**vi .env**" and for env variable '***MONGODB_URL***' enter the URL to connect to mongo DB, save the file and exit.
6. Execute "**npm run start**" and it will start the http server on port **3000** (or the one you have updated in **.env** file)

### Server REST API:
1. `POST /records/filter`
Enter for ex. below body with POST request
```typescript
{
    "startDate": "2016-01-26",
    "endDate": "2018-02-02",
    "minCount": 800,
    "maxCount": 3000
}
```
And it responds with below format (typescript interface representation)
```typescript
interface Response {
    code: 0,
    msg: "Success",
    records: Array<{
      key: string,
      createdAt: string, // ISO date string
      totalCount: number
    }>
}
```
If POST body is invalid or if there is an error in processing request then response will be returned in below format:
```typescript
interface Response {
    code: 400 | 500, // Http error code
    msg: string, // Describes error reason
}
```
