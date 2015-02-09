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

    //// BTN-LISTENERS ////
        var confBtn = document.getElementById("configBtn");

        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OVER, functionOverBtn,confBtn);
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OUT, functionOutBtn,confBtn);
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_START, functionHoldStartBtn,confBtn,{handClosed:true});
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS, functionHoldProgressBtn,confBtn,{handClosed:true});
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_END, functionHoldEndBtn,confBtn,{handClosed:true});


    //// BTN-EVENTS-FUNCTIONS ////
        function functionOverBtn(target) {};

        function functionOutBtn(target) {
            $('.loader').css('opacity', '0');
        };

        function functionHoldStartBtn(target) {};

        function functionHoldProgressBtn(target, progress) {
            $('.loader').css('opacity', '1');
            $('.loader--inpt').val((progress * 200)).trigger('change');

            if ((progress * 100) == 50) {
                var boardDsply = $("#configBoard").css('display');

                if (boardDsply == 'none') {
                    $("#configBoard").css('display', 'block');
                } else if (boardDsply == 'block') {
                    $("#configBoard").css('display', 'none');
                }
            };

            if ((progress * 100) < 50) {
                setTimeout(function(){
                    $('.loader').css('opacity', '0');
                }, 750);
            }
        };

        function functionHoldEndBtn(target) {

            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_START, functionHoldStartBtn,confBtn,{handClosed:true});
            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS, functionHoldProgressBtn,confBtn,{handClosed:true});
            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_END, functionHoldEndBtn,confBtn,{handClosed:true});

        };

    });


})();

