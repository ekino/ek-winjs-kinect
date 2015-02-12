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

            if(dragController.isRefresh())
            {
                $square.css({left:-dragController.x,top:-dragController.y});
            }

            dragController.update();
            window.requestAnimationFrame(update);
        }

        update();



        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);

        function functionMoveHandler(target) {

            posX+= (body.pointer.x - posX)*  0.8;
            posY+= (body.pointer.y - posY) * 0.8;

            $cursor.css({left:  posX - 10, top:   posY - 10, opacity: 1 });
        };



    });

})();

