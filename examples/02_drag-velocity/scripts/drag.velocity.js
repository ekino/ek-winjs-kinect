(function(){
    "use strict";


    var kinect = EkWinjs.Kinect.getInstance();
    var body = kinect.bodyFrame.getSelectedBody();


    $(document).ready(function() {

        var $square = $('.square');

        var dragController = new EkWinjs.DragController(body,$square[0],0.1,1);

        function update(){

            if(dragController.isRefresh())
            {
                var posX = -dragController.x+"px";
                var posY = -dragController.y+"px";

                $square.css({
                    transform: 'translate3d('+posX+','+posY+','+0+'px)'
                });

            }

            dragController.update();
            window.requestAnimationFrame(update);
        }

        update();

    });

})();

