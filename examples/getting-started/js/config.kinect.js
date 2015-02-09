(function(){
    "use strict";


    var kinect = EkWinjs.Kinect.getInstance();

    kinect.addCanvasDebug("mainCanvas");

    kinect.addCanvasDebug("resultCanvas", true);

    var body = kinect.bodyFrame.getSelectedBody();


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


})();

