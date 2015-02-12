(function(){
    "use strict";

    var posX = 0;
    var posY = 0;


    var kinect = EkWinjs.Kinect.getInstance();
    var body = kinect.bodyFrame.getSelectedBody();


    $(document).ready(function() {

        var $cursor = $('.cursor');
        var $square = $('.square');

        var dragController = new EkWinjs.DragController(body,$square[0],0.1,1);


        function update(){

            //console.log("-- "+dragController.x);
            if(dragController.isRefresh())
            {

                $square.css({left:-dragController.x,top:-dragController.y});
            }

            dragController.update();
            window.requestAnimationFrame(update);
        }

        update();



        //body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);


        //// GRID-EVENTS-FUNCTIONS ////
        function functionMoveHandler(target) {
            console.log("functionMoveHandler ",body.pointer.x )

            posX+= (body.pointer.x - posX)*  0.5;
            posY+= (body.pointer.y - posY) * 0.5;

            $cursor.css({left:  posX - 10, top:   posY - 10, opacity: 1 });
        };



    });

})();

