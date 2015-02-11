# ek-winjs-kinect
The main goal of the library is to speed up the setup process
for coding Kinect interactions by web developers.

With the new **Kinect for Windows SDK**, you can use the Javascript
Kinect API in Windows 8 applications.

Read this article to know the new possibilities of Kinect for Windows (V2):
http://www.ekino.com/kinect-v2-implementation-javascript/

But the Kinect Javascript SDK isn't really plug and play with an HTML5 application.

So, the library give you the possibility to **code your first Kinect interaction easy as
using mouse/touch events in Javascript**. (See the Getting Started section)


## Installation

#### 1) Install Kinect For Windows(K4W) SDK:
http://www.microsoft.com/en-us/download/details.aspx?id=44561


#### 2) Install Apache cordova
Needed to build a Windows 8 Html5 application container

http://cordova.apache.org/docs/en/4.0.0/guide_overview_index.md.html

    npm install cordova  -g


#### 3) Install development environment : (npm, grunt, bower, sass)
Skip this step if you already have nodejs, grunt, bower and sass installed.

- nodejs : http://nodejs.org

- sass : http://sass-lang.com/install
    
- grunt :  http://gruntjs.com/installing-grunt

        npm install grunt -g

- bower : http://bower.io

        npm install bower -g


#### 4) Install project and samples dependencies
- Install node_modules dependencies

	Execute the next command in the root of the project

        npm install


- Install Javascript and Css dependencies

        bower install


## Getting started

Event if the Kinect SDK only works on Microsoft Win8 platform
you can program interaction on others platform because the EK-WinJS-Kinect library will emulate the events with the mouse on your browser.  

#### Launch the samples in your browser

- Launch a local server

		grunt serve --livereload
    
- Check the simple pointer demo

http://localhost:9000/simple-pointer/

![Image](/docs/assets/simple-pointer-demo.png?raw=true)

And move your mouse over the squares...  
Ooooooh crazy ! It's a Kinect Interaction !

Let's plug the kinect !

#### Launch the samples in a Windows 8 application.

Because the Javascrip kinect SDK is linked with
C++ library you need to install Visual Studio to build
applications for Windows 8.


- Install Visual Studio

	http://www.visualstudio.com/fr-fr/downloads/visual-studio-2015-downloads-vs

- Build the Cordova windows 8 application

		grunt build-win8


- Go to the ek-winjs-kinect/platforms/windows/ folder
- Open CordovaApp.sln with Visual Studio.
- Build the app by clicking on the "Local Machine" button.
- Authorize the Camera and Microphone if needed
- Click on the  "00 - Getting Started" link to show the detection screen



## Features
- Target one player on a specific area

        //(x, xDeph, z, zDeph);
        var body = kinect.bodyFrame.trackBodyOn(0.5, 0.2, 1.5, 0.2);

- Fallback the API with Mouse Event on a browser
- Automatically switch between right or left hand interaction
- Windows 8 store ready to package with cordova
- Draw the body joints to canvas for debugging
- Manage drag and drop easily with new EkWinjs.DragController(body,document.body,0.1,0.5);


## Roadmap
- Add multiple addEventListeners on the same target
- Add simple  gestures like swipe, zoom, smile, wink etc.
- Optimize right vs left hand interaction
- Target multiple player on different area
- Show the Kinect camera on screen
- Manage event bubbling on target listeners

