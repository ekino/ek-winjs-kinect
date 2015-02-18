(function(){
    "use strict";


    var kinect = EKjs.Kinect.getInstance();
    var body = kinect.bodyFrame.getSelectedBody();


    $(document).ready(function() {

        var $cube = $('#cube');

        var dragController = new EKjs.DragController(body,document.body,0.1,1);

        function update(){

            if(dragController.isRefresh())
            {
                var posX = dragController.rotateX+"deg";
                var posY = dragController.rotateY+"deg";

                $cube.css({
                    transform: 'rotateX('+posX+') rotateY('+posY+')'
                });
            }



            dragController.update();
            window.requestAnimationFrame(update);
        }

        update();

    });

})();

