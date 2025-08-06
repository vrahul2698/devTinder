<!-- DEV TINDER API's LIST -->

# Need to Uuse Separaet route files to handle different routes

## authRouter

-POST/signup
-POST/login
-POST/logout


## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password



## connectionRequestRouter

- POST /request/send/interested/:userID
- POST /request/send/ignored/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID


## userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform

STATUS - ignore,interested,accepted,rejected