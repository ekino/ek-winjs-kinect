(function(){
    "use strict";


    var kinect = EKjs.Kinect.getInstance();
    var body = kinect.bodyFrame.getSelectedBody();


    $(document).ready(function() {

        var $square = $('.square');

        var dragController = new EKjs.DragController(body,$square[0],0.1,1);

        function update(){

            if(dragController.isRefresh())
            {
                var posX = -dragController.x+"px";
                var posY = -dragController.y+"px";
                var posZ = -dragController.z+"px";


                $square.css({
                    transform: 'translate3d('+posX+','+posY+','+posZ+')'
                });

            }



            dragController.update();
            window.requestAnimationFrame(update);
        }

        update();

    });

})();

