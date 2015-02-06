(function(){
    "use strict";

    var ekolors = [
        "#A9A8A9",
        "#8CB7E8",
        "#00ADBB",
        "#3A5CAC",
        "#7B6568",
        "#B5A268",
        "#FFB718",
        "#FF4611",
        "#DC0031"
    ];


    var kinect = EkWinjs.Kinect.getInstance();
    var body = kinect.bodyFrame.trackBodyOn(0.5, 0.2, 1.5, 0.2);



//// GRID-LISTENERS ////
    var tiles = document.getElementsByClassName("element");

    for (var i = tiles.length - 1; i >= 0; i--) {
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OVER, functionOver,tiles[i]);
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OUT, functionOut,tiles[i]);
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_START, functionHoldStart,tiles[i],{handClosed:true});
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS, functionHoldProgress,tiles[i],{handClosed:true});
        body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_END, functionHoldEnd,tiles[i],{handClosed:true});
    };

    body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);


    var posX = 0;
    var posY = 0;

//// GRID-EVENTS-FUNCTIONS ////
    function functionMoveHandler(target) {


        posX += (body.pointer.x - posX) * 0.5;
        posY += (body.pointer.y - posY) * 0.5;

        $('.loader').css({
            left:  posX - 25,
            top:   posY - 25
        });

        $('.cursor').css({
            left:  posX - 10,
            top:   posY - 10,
            opacity: 1
        });
    };

    function functionHoldStart(target) {

        var ekolor = ekolors[Math.floor(Math.random() * ekolors.length)];
        target.childNodes[0].style.background = ekolor;
        target.style.background = "black";
    };

    function functionHoldProgress(target,progress) {

        $('.loader').css('opacity', '1');
        target.childNodes[0].style.width = (progress * 100) + "%";
        target.childNodes[0].style.height = (progress * 100) + "%";
        target.childNodes[0].style.left = 50 - ((progress * 100)/2) + "%";
        target.childNodes[0].style.top = 50 - ((progress * 100)/2) + "%";
        target.childNodes[0].style.opacity = progress;
        $('.loader--inpt').val((progress * 100)).trigger('change');

        if ((progress * 100) < 100) {
            setTimeout(function(){
                $('.loader').css('opacity', '0');
            }, 750);
        }
    };

    function functionHoldEnd(target) {

        $('.loader').css('opacity', '0');
        target.style.opacity = 1;
        $(target.className).removeClass("square");
        $(target.className).addClass("circle");
        target.style.background = ekolor;
    };

    function functionOver(target) {

        if (hasClass(target,"square")) {
            target.style.borderRadius = "50%";
        } else if (hasClass(target,"circle")) {
            target.style.borderRadius = "0%";
        }
    };

    function functionOut(target) {

        $('.loader').css('opacity', '0');
        if (hasClass(target,"square")) {
            target.style.borderRadius = "0%";
        } else if (hasClass(target,"circle")) {
            target.style.borderRadius = "50%";
        }
    };


/////////////////////////////////////////
///////////////-TOOLS-///////////////////
/////////////////////////////////////////

    function hasClass(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }


    $(".loader--inpt").knob({
        'min':0,
        'max':100,
        'width':50,
        'thickness':0.2,
        'fgColor':"#FFB718",
        'displayInput':'false'
    });

})();

