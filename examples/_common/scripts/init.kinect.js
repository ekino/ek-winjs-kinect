(function(){
    "use strict";


    var kinect = EKjs.Kinect.getInstance();

    //track body on specific 3D area .trackBodyOn(x,xDeph,z, zDeph);
    var body = kinect.bodyFrame.trackBodyOn(0.5, 0.2, 1.5, 0.2);

    //use kinect.bodyFrame.getSelectedBody() on samples to catch the selected user.

    var posX = 0;
    var posY = 0;


    $(document).ready(function() {

        var $cursor = $('.cursor');
        var $loader = $('.loader');
	    var $loader__input = $(".loader__input");
	    $loader__input.knob({
		    'min':0,
		    'max':100,
		    'width':50,
		    'thickness':0.2,
		    'fgColor':"#FFB718",
		    'displayInput':false
	    });

        body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);
        body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.UP, functionUpHandler, document.body);
        body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.DOWN, functionDownHandler, document.body);




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


	    var $closeBtn = $('.closeButton');
	    console.log($closeBtn)
		if($closeBtn[0])
		{
			body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.HOLD_END, functionHoldEnd,$closeBtn[0],{handClosed:true});
			body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.HOLD_START, functionHoldStart,$closeBtn[0],{handClosed:true});
			body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.HOLD_PROGRESS, functionHoldProgress,$closeBtn[0],{handClosed:true});
		}
	    function functionHoldStart(target) {
		    $loader.css('opacity', '1');
	    };

	    function functionHoldProgress(target,progress) {
		    $loader__input.val((progress * 100)).trigger('change');

	    };

	    function functionHoldEnd(target,progress) {

		    var $target = $(target);

		    $loader.css('opacity', '0');

		    document.location = "/examples";

	    };


    });

})();