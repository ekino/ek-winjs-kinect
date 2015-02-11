(function(){
    "use strict";

    var posX = 0;
    var posY = 0;


    var kinect = EkWinjs.Kinect.getInstance();
    var body = kinect.bodyFrame.getSelectedBody();


    $(document).ready(function() {

        var $cursor = $('.cursor');


        var dragController = new EkWinjs.DragController(body,document.body,0.001,1);


        function update(){

            if(dragController.isRefresh())
            {
                console.log("-- "+dragController.x);
            }

            dragController.update();
            window.requestAnimationFrame(update);
        }

        update();



        //body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);


        //// GRID-EVENTS-FUNCTIONS ////
        function functionMoveHandler(target) {

            posX+= (body.pointer.x - posX)*  0.5;
            posY+= (body.pointer.y - posY) * 0.5;

            $cursor.css({left:  posX - 10, top:   posY - 10, opacity: 1 });
        };



    });

})();

