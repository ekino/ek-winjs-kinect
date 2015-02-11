(function(){
    "use strict";

    var posX = 0;
    var posY = 0;

    var kinect = EkWinjs.Kinect.getInstance();
    var body = kinect.bodyFrame.getSelectedBody();

    kinect.addCanvasDebug("mainCanvas");
    kinect.addCanvasDebug("resultCanvas", true);


    $(document).ready(function() {

        var $loader = $('.loader');
        var $cursor = $('.cursor');


        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);

        //// GRID-EVENTS-FUNCTIONS ////
        function functionMoveHandler(target) {

            posX+= (body.pointer.x - posX)*  0.5;
            posY+= (body.pointer.y - posY) * 0.5;

            $loader.css({left:  posX - 25, top:   posY - 25});
            $cursor.css({left:  posX - 10, top:   posY - 10, opacity: 1 });
        };




    });


})();

