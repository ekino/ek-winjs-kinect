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
        var $loader = $('.loader');
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.UP, functionUpHandler, document.body);
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.DOWN, functionDownHandler, document.body);


        function functionUpHandler(target) {

            if ($cursor.hasClass("cursor--active")) {
                $cursor.removeClass("cursor--active");
            }
        }
        function functionDownHandler(target) {

            if (!$cursor.hasClass("cursor--active")) {
                $cursor.addClass("cursor--active");
            }
        }


        function functionMoveHandler(target) {

            posX+= (body.pointer.x - posX)*  0.8;
            posY+= (body.pointer.y - posY)* 0.8;

            var px = posX-10+"px";
            var py = posY-10+"px";

            $cursor.css({
                transform: "translateX("+px+") translateY("+py+")",
                opacity: 1
            });

            if($loader){

                px = posX-25+"px";
                py = posY-25+"px";

                $loader.css({
                    transform: "translateX("+px+") translateY("+py+")"
                });

            }
        };

    });

})();