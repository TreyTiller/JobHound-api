# To read more about the app head to the client repo! https://github.com/TreyTiller/JobHound-client

## This application was built using the following:

       -React
       -HTML
       -CSS
       -JavaScript
       -JSX
       -Node
       -Express
       -Mocha/Chai/Enzyme
       -PostgreSQL
       
## API Endpoints:

### User Login
Returns a JWT for use as authentication throughout the application

* URL:
  /login
  
* Method:
  POST
  
* Url Params:
   None

* Data Params:
   None
   
### Listing
Returns a JSON object with recipe meta information inside
( Title, Skill, Time, Coffee amount, Water amount )

* URL:
  /api/listings/:user_id
  
* Method:
  GET
  POST
  PUT
  DELETE
  
* Url Params:
   user_id travels with JWT after login as a param
   user_id: [integer]

* Data Params:
   When posting to this enpoint the listing title, stage, and company_name, location are all required

### Registration
Creates user credentials to use for login

* URL:
  /api/users
  
* Method:
  POST
  
* Url Params:
   None

* Data Params:
   All inputs in form (nickname, username, password) are required

