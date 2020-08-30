# PASSPORT OAUTHENTICATION TUTORIAL

This is a basic tutorial for how to implement Passport's OAuth2.0 for Google Authentication. 

## What is Passport?
Passport is an Authentication Middleware designed for Node.js. This can be extremely useful in allowing your user to make an account without needing to remember more usernames and passwords. Additionally, being able to access parts of the users account in other respects allows for smaller sign up forms; as information like a users name, email, and other profile information can easily be gotten from authenticating through an external process.  
  
Passport is the main middleware service for external authentication, allowing for authentication of 502 strategies including Google, Twitter, Facebook, Reddit and more.  
  
By allowing users to sign in with a pre-existing account, it lowers the barrier for entry between a User and your end product, allowing for more people to more easily access your website.

## Google OAuth2.0 Tutorial
### What this tutorial expects
This tutorial expects that you:
- Have experience in Node.js, and have already set up a new project.
- Have experience using Express, and add an express app to your Node.js project.
  
### 1. Install Passport and Passport-google-oauth2
Passport and Passport-google-oauth2 are how we can use passport within our Node.js project.  
  
After creating your initial Node.js project, navigate to your project directory within the Terminal and install passport and Passport-google-oauth2 using the following commands:  
  
``` npm install passport --save ```  
``` npm install passport-google-oauth2 ```
  
Now, check that both are within your package.json as Dependencies. Your listings should look similar to the following:  
``` 
    "passport": "^0.4.1",
    "passport-google-oauth2": "^0.2.0",
```
Now, we need to make sure that we can use both packages within our server.js file. This is done by using the 'require' command when assigning objects. For the purpose of this tutorial, we will be using the following variables:
```
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
```
##### Note; the GoogleStategy require function ends with a Strategy assignment. This is a function given by passport that allows us to assign a strategy to how passport can authenticate the user. This will be covered later.  

Now that we have installed and initialised our Passport and Google Strategy variables, lets work out what we need to use them.  
### 2. Acquire Google_Client_ID and Google_Secret  
  
On Google's end of the transaction, they need to make sure that they are able to receive the request properly, and authenticate that where it is coming from is a valid location. Google's Strategy requires the use of 2 different keys that can be checked on each authentication request; the Client ID and the Secret Key. These keys are the how Google tests the validity of requests from a web app.  
  
To obtain a Client and Secret Key, go to the [Google developers page](http://console.developers.google.com), and under select a project, create a new project. Then, under the credentials tab, create new credientials and select the OAuth Client ID. Finally, you will be left with a form to fill out, requiring an Application Type (we are creating a Web Application), a project name, Authorised JavaScript URI and Authorised redirect URI's.  
  
  Authorised JavaScript URI is the URL that you are expecting the authentication request to come from. For the sake of this tutorial, we will be running the server locally, so we can use our local host. As such, we will add ```http://localhost:3000``` to the Authorised JavaScript URI.  
    
  Authorised Redirect URI is the URL that you want to redirect to after the Authentication has taken place. This is usually a location within your website archetecture that is otherwise unaccessable, and serves as a middle point to redirect to another page. For this example, we will be adding ```http://localhost:3000/auth/google/redirect``` as our main redirect URI.  
    
##### Note; both the Auth JS URI and Auth Redirect URI can have multiple entries, meaning that multiple different websites and Redirects can be recognised. However, this does not define where your user will be directed, that is controlled in the next step.
  
After completing this form, your will receive both your client ID and client Secret for your project. Make a note of these, as they will be used in the next step. If more information is required about this step; follow this [useful tutorial](https://theonetechnologies.com/blog/post/how-to-get-google-app-client-id-and-client-secret).
  
### 3. Using the Google_Client_ID and Google_Secret
Now that we have our Client_ID and Secret, we can finally start to implement passport. Within our server.js file, we need to use the GoogleStrategy that we defined in Step 1, and initialise and use our Passport session.  
  
Firstly, we need to use the GoogleStrategy. This can be done by creating a new GoogleStrategy instance, and defining how we want to use the users profile.  
```
passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect
    }, (accessToken, refreshToken, profile, done) => {

    }
));
```
This piece of code uses the Client ID and Secret made in the previous step, as well as defining the URL which the user will be sent to after a successful authentication. In this example, i have used `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as placeholders. If you are planning to host your project, you should use environment variables as the clientID and clientSecret are personal, and should not be accessable by the user.  
  
Additionally, this allows us access to the four different response variables:
- accessToken: Defines what information our program is and isn't allowed from the users Google profile. What we will be using is defined in a later step.
- refreshToken: Allows the AccessToken to be refreshed when requesting different data.
- profile: the requested users profile. This is where we can obtain information like the users name, age, and email.
- done: a function that we can call within the strategy definition, and which ends the strategy.  
  
Our function should be completed, so we need to include a done function within our definition. If we needed to check whether this user has previously logged in to our website before, this is where we could check the user against a database, using the `profile.id` as an identifier. We will be using the profile ID, and the First name of the user that has logged in; giving that to the `done()` function.
```
passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect
    }, (accessToken, refreshToken, profile, done) => {

        User = {name: profile.givenName, id: profile.id}
        done(null, User);

    }
));
```
This sums up the usage of GoogleStrategy. Now, we need to initialise a new Passport session. This is done using the following code:
```
express.use(passport.initialize());
express.use(passport.session());
```
### 4. Serializing the User, and using Cookies.
Before we can finally start using OAuth, we need to make sure that passport is able to function correctly. This requires two more items: Serializing (and deserializing) the user, as well as letting our application use cookes.  
In order to serialize and deserialize our user, the following code can be added before the use of `express.use(passport.initialize());`:
```
passport.serializeUser((user, done)=> {
    done(null,user.id);
});
passport.deserializeUser((user, done)=> {
    done(null,user)
});
```
##### Note: to deserialize the user, we must know exactly what user to deserialize. This can be done by searching through a database of users, parsing through the id instead of the user, however in our case, as we can only have one user at a time, this solution will work.
  
Next, we need to add cookies to our system. This allows the user to stay logged in even if they have left the website. This is required by passport, and without cookies, authentication will not work. To implement cookies, we need to install and require a new middleware:  
In the terminal, enter `npm install cookie-session --save`  
In your server.js file, place `const cookies = require('cookie-session');` near the other object definitions.  
  
Finally, before we initialize the passport session, we need to include the following code:
```
express.use(cookies({
    maxAge:24*60*60*1000,
    keys:[COOKIE_KEY]
}));
```
The variable `COOKIE_KEY` is used in placement of a random key that is used to validate cookies. Use a random sequence of numbers, as this is the only place that the key is used. This is something that the end user should not be able to access directly, and as such, should be an environment variable before deployment. Other variables for the cookies can be defined, look at the [Cookie-session documentation](https://www.npmjs.com/package/cookie-session) to see what other variables can be set.

### 5. Logging In.
Now that we have all of the big infrastructure in place, we need a way for the user to log in. This can be done any number of ways, however, we will be watching for a specific URL page to be requested, and then authenticate the user and send through the user details.  
To do this, we need to use the `express.get()` function to watch a specific path. We will be using the path `'/auth/google'`.  
```
express.get("/auth/google",passport.authenticate("google",{
    scope:["profile","email"]
}));
```
This requests the users profile to be accessable by our webapp, as well as the users email. The different parameters of what we can use within a scope are found [here](https://developers.google.com/identity/protocols/oauth2/scopes#identitytoolkit). Additionally, when the user requests `localhost:3000/auth/google`, they will be redirected to the authentication page. After the user has been authenticated, Google will redirect them to one of the Redirect URI's that we specified in Part 2. As such, we should also control what happens to the user when they reach that URI (in our example, it is `localhost:3000/auth/google/redirect`).
```
express.get("auth/google/redirect", passport.authenticate('google'),(req,res)=> {
    const user = req.user;
    app.locals.user = user;
    res.redirect('/');
});
```
This function saves the user parameter that we defined within our GoogleStrategy in part 3. Additionally, it redirects the user to the home directory within the website. This redirect however can be to any valid path within your website.  
  
Finally, we need a method of accessing the user data in other places within the website. Currently, the authentication is all taking place in server.js, however if we needed to access the user data in another file, we wouldn't be able to. What we can do, is use one more express get request, and call this request whenever we need the data of the current user. This can be done using the following code:
```
express.get("auth/google/user",passport.authenticate('google'),(req,res)=>{
    res.send(req.user);
});
```
Now,whenever we require the user's data, we can make a request to "auth/google/user" in order to retreve the data. For example, this listening could be done using the following:
```
$.get('/auth/google/user', (res)=> {
    ...
});
```
This would be especially useful if using an app.js file to control the different webpages within your webapp.

### 6. Uploading (Optional)
When trying to upload and host your webapp, be aware of the use of environment variables throughtout the project, and whether your hosting service is able to naitively support `.env` files, or whether they have their own system. For example, Heroku does not support `.env` files being included in their uploads. However, Heroku does allow you to upload your own environment variables to their webserver, through their online management system. Copying your `.env` files contents into this service functions exactly the same has having the `.env` file locally.

## Final Remarks
Overall, OAuth is simple to implement using the Passport middleware. However, keep in mind that this Tutorial only shows the absolute basics of what passport is capable of. Passport have over 500 different Strategies that can be used for all sorts of different web services and API's. To learn more about Passport, read their [Documentation](http://www.passportjs.org/).

##### By: Shaine Christmas
##### Deakin StudentID: 219206645