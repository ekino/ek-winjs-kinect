(function(){
    "use strict";


    var kinect = EkWinjs.Kinect.getInstance();

    //track body on specific 3D area .trackBodyOn(x,xDeph,z, zDeph);
    var body = kinect.bodyFrame.trackBodyOn(0.5, 0.2, 1.5, 0.2);

    //use kinect.bodyFrame.getSelectedBody() on samples to catch the selected user.

    var posX = 0;
    var posY = 0;



    $(document).ready(function() {

        var $cursor = $('.cursor');
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);

        function functionMoveHandler(target) {

            posX+= (body.pointer.x - posX)*  0.8;
            posY+= (body.pointer.y - posY) * 0.8;

            $cursor.css({left:  posX - 10, top:   posY - 10, opacity: 1 });
        };

    });

})();