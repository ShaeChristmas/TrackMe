# React Tutorial
## What is React?
React is a Javascript Library that is used for Building User interfaces in Web development.  
The main aspect of react is to segment UI code, into pieces called Components. Each Component controls one small aspect of the UI, and can be used multiple times within the website (Similar to how a navigation bar is something that is used throughout the whole website).  
First, lets have a look at a simple React Component for some text.
```
class textReact extends React.Component {
    render() {
        return (
            <div>
                <h1>This is a heading</h1>
                <p> This is part of a paragraph<br></br>
                This is the second line in the paragraph.</p>
            </div>
        );
    }
}
export default textReact;
```  
This simple react Component contains a simple `<div>` html group. Html is used within react, for this example, to aid in the rendering. If we were able to change the text within the component (with a div ID tag), then the text would dynamically update, and re-render whenever it receives a change. This is the main power behind React for web development.  
## Installation
To install React, Node.js is required. Go to the [Node.js website](https://nodejs.org/en/) to install Node.js.  
  
Next, we need to create a new project. Navigate in the terminal to the directory where you would like your project to be stored, and run the following command:  
```
npx create-react-app PROJECT_NAME
```  
Feel free to replace `PROJECT_NAME` with the name of your project.  
  
This command will install all of the dependencies required to work with React, as well as organise the correct filing system and data structures required.  
Using the command ```npm start``` at this stage will show the default React project.
## index.js and App.js relationship
Looking at the default project, we can see that within the `/src` folder, we can see the files `App.js` and `index.js`. These two files are what control the flow of the default react project. Within `App.js`, the React Component is defined, and exported.
```
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      ...
    </div>
  );
}

export default App;

```
##### Additionally, a logo and a css file are used as well. If you are experienced with css and html development, see how both are implemented within the App() function.
Moving on to `index.js`, we can see that the code within is quite simple. This is because `index.js` is the code that the server is running, and it is calling upon the App class that is defined within the `App.js`. This is the basis behind the modular nature of React: allowing the user to define different classes, and use those classes easily to define what is being shown on the webpage.  
  
## Displaying some Text
For our purposes, we will be re-writing the `app.js` and `index.js` files. In order to allow us to use our own code, we can remove the `div "App"` within the `App()` function. Additionally, we wont need to reference the Logo within `App.js`, so we can remove its import line. Now, our App.js should look like this:
```
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
```
Within our App divider, lets place some text! You can place in whatever html formatted text you like, however we will be using the sample text displayed earlier within this document.
```
function App() {
  return (
    <div className="App">
      <div>
        <h1>This is a heading</h1>
        <p> This is part of a paragraph<br></br>
        This is the second line in the paragraph.</p>
      </div>
    </div>
  );
}
```
Now, running `npm start` in the terminal show show your text! This is the absolute basics of how we can use React.  
One thing to note about React, and Javascript more specifically, is that classes can be called as objects. As such, we can change our `App()` function into a class simply by changing
```
function App
``` 
to 
```
class App extends React.Component
```
Additionally, as it is now not a function, we need to ensure that the class has a render function. We can define this by simply placing our current return function within a render function definition.
```
class App extends React.Component {
    render() {
        return (
            <div className="App">
              <div>
                <h1>This is a heading</h1>
                <p> This is part of a paragraph<br></br>
                This is the second line in the paragraph.</p>
              </div>
            </div>
        );
    }    
}
```
This allows us to use some more advanced parts of React, including defining functions based on a variable or program state. Lets say for example that we want to use data within the class. well, we can get data from other sources, and either log them wthin the developer console, or use them within our text area. Before our class definition, lets create a variable and assign it a value.
```
var testing_int = 5;
```
We are setting this variable as an example. If we wanted to get a variable, or a list from elsewhere, we could import the list/variable just as we can import the `'./App.css'` file, or the image from the default project.  
Now, with our variable, we can include this directly within our html text, using the following syntax:
```
<p> The testing_int variable is equal to {testing_int}.</p>
```
This line creates a new paragraph, and directly calls upon the definition of `testing_int` earlier within the document. In this case, React is allowing us to bridge the gap between JavaScript logic and html display.  
Looking at our webpage now, we can see that the value of testing_int is displayed.

## Updating Elements
  
Lets see if we can change the value of testing_int within our webpage.  
To start, lets place two buttons in our `<div>` class:
```
<button onClick={}>Increase the value</button>
<button onClick={}>Decrease the value</button>
```
Here, we have created two buttons that have an onClick event. Usually, in a non-react website, onClick is used for redirecting the user. However, we can define functions within the onClick section, to edit the `testing_int` variable
```
<button onClick={()=> {
    testing_int++;
}}>Increase the value</button>
```
Whilst this does increase the value of testing_int, one aspect of React that is required whenever you want to update what is being displayed is that the object needs to be re-rendered. We can do that by adding the function `this.forceUpdate();` to our `onClick` function:
```
<button onClick={()=> {
    testing_int++;
    this.forceUpdate();
}}>Increase the value</button>
```
Using a similar process, we can now edit the button for decreasing the value, and updating the element to display the new value.

## Using states to Change Pages

Let's add a second page to the project. We've added `About.js` with the following code:
```
import React from 'react';
import './App.css';

class About extends React.Component {
  render() {
    return (
        <div className="About">
          <div>
              <h1>
                  About
              </h1>
              <p>This is a basic about page.<br></br>
              It would contain details about how your website is made<br></br>
              </p>
              <br></br>
              <p>Developed by YOU!</p>
          </div>
        </div>
    );
  }    
}

export default About;
```
However, we currently have no way to access this page. To do so, lets make a new file called `Navigate.js`, with this starting code:  
```
import React from 'react';
import './App.css';
import App from './App';
import About from './About';

class Navigate extends React.Component {
    render() {
        return (
        )
    }
}

export default Navigate;
```
We need to import all of the Other files that we have used thus far, as this will allow us to navigate between different pages.  
  
In order to change the page that is being displayed, we should store the current page as a state, and change the state when we need to change the page. React natively has states for its classes, so we can just assign a state inside the class;
```
state ={file:<App/>}
```
This allows us to set the state variable `file` to a file that we want to display. To set the state properly, we need to use `this.setState()`, and defining what we want to update in the parameters. However, using `this.` requires us to set up a constructor, and use the `super()` function. Within our Navigate class, we need the following constructor:
```
constructor() {
    super();
}
```
This doesn't look like it does much, however this is what allows us to use the `this.` prefix.  
  
Now that we can use '`this.`', we could just change the state of the class by using the following command:
```
this.setState({file: PATH})
```
where we replace `PATH` with the File that we would like to use. However, to make it more clear what is going on, as well as to simplify our navbar code, lets define the following function within the Navigation class:
```
changePath(newPath) {
    this.setState({file: newPath});
}
```
This simplifies how we change the states, and allows us to easily call `this.changePath(newPath);` rather than `this.setState({file: newPath});`.  
  
Now that we've sorted out how we can change the state of our program, lets define how the state actually displays the file. Within `index.js` we have the following code that allows the `App` object to be run:
```
<React.StrictMode>
    <App />
</React.StrictMode>
```  
  
The part that defines the File to use is the `<App />` line, so we could set that to a variable within our Navigation page. Within our `render()` function in the navigation class, we can have the following code:
```
render() {
    return (
        <React.StrictMode>
            {this.state.file}
        </React.StrictMode>
    )
}
```
This allows us to display the file that is present within our `state.file` variable. This does mean that our `file` variable needs to be formatted as follows:  
`< CLASS_NAME />`  
We can control this when we call our ChangePath function.  
  
Now that we have control over what is displayed; we need to add the ability to change the page with some new buttons. These will be placed in the `render()` function, before the `<React.StrictMode>`.
```
<button onClick>App</button>
<button onClick>About</button>
```
within our button onClick events, we can add the `this.changePath` function that we defined earlier.
```
<button onClick={()=>{
    this.changePath(<App/>);
}}>App</button>
<button onClick={()=>{
    this.changePath(<About/>);
}}>About</button>
```
This allows our buttons to load the file that is being requested. As they are changing what file is being rendered, they do not need the `forceUpdate()` function that was required in `App.js`. However, we cannot have both of the buttons and the `<React.StrictMode>` divider as well within our return function. This is because you can only parse through one html element in the return function. The way around this is to Fragment the current code. This can be done by wrapping everything currently in the return function in the `<React.Fragment>` divider, as seen here:
```
return (
    <React.Fragment>
        <button onClick={()=>{
            this.changePath(<App/>);
        }}>App</button>
        <button onClick={()=>{
            this.changePath(<About/>);
        }}>About</button>
            <React.StrictMode>
                {this.state.file}
            </React.StrictMode>
    </React.Fragment>
    )
```
`<React.Fragment>` allows us to group different pieces of code, for parsing, and they can run separately when being rendered.  

Now, we have some navigation buttons, that also allow us to change what is being displayed. However, currently this is not being displayed. This is because in `package.json`, the `index.js` file is defined to be the starting point of the server. Looking inside `index.js`, we see that `<app />` is the file that is being run. If we import our `Navigation.js` file, and use it within the `<React.StrictMode>`, then our buttons will appear as we want them to.
```
import Navigate from './Navigate'

ReactDOM.render(
    <React.StrictMode>
        <Navigate />
    </React.StrictMode>
    document.getElementById('root')
);
```
Now, you should have a complete system, with two pages; our number assignment `App` page from `App.js` and our `About` page from `About.js`, both accessable with buttons at the top of the pages.

## Final Remarks
This tutorial covers the absolute basics of React, including States, Classes, and the rendering of changing elements. For further information on React, read the [React Documentation](https://reactjs.org/docs/). Overall, you can use the skills from this tutorial to make basic websites with multiple pages. However, React is a powerful tool that allows for heavy customisation and advanced User Interface development any level of complexity website.

##### By: Shaine Christmas
##### Deakin StudentID: 219206645