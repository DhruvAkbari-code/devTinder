# DevTinders APIs

# authRouter

- POST /signup
- POST /login
- POST /logout

# profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# requestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

# UserRouter

- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the profiles on the feed
