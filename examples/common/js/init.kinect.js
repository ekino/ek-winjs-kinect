(function(){
    "use strict";


    var kinect = EkWinjs.Kinect.getInstance();

    //track body on specific 3D area .trackBodyOn(x,xDeph,z, zDeph);
    var body = kinect.bodyFrame.trackBodyOn(0.5, 0.2, 1.5, 0.2);

    //use kinect.bodyFrame.getSelectedBody() on samples to catch the selected user.

})();