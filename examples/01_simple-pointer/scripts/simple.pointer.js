(function(){
    "use strict";

    var ekolor;

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
    var body = kinect.bodyFrame.getSelectedBody();


    $(document).ready(function() {

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

        //// GRID-LISTENERS ////
        var tiles = document.getElementsByClassName("element");

        for (var i = tiles.length - 1; i >= 0; i--) {
            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OVER, functionOver,tiles[i]);

            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OUT, functionOut,tiles[i]);
            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_START, functionHoldStart,tiles[i],{handClosed:true});
            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS, functionHoldProgress,tiles[i],{handClosed:true});
            body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_END, functionHoldEnd,tiles[i],{handClosed:true});
        };


        function functionHoldStart(target) {

            ekolor = ekolors[Math.floor(Math.random() * ekolors.length)];

            var $target = $(target);
            $target.css({background:"#000000"});
            $target.children('.element__zoom').css({background:ekolor});
        };

        function functionHoldProgress(target,progress) {

            var $target = $(target)
            $loader.css('opacity', '1');

            $target.children('.element__zoom').css({
                transform:"scale("+progress+")",
                opacity:progress
            });


            $loader__input.val((progress * 100)).trigger('change');

            if ((progress)<1) {

                setTimeout(function(){
                    $loader.css('opacity', '0');
                }, 750);
            }
        };

        function functionHoldEnd(target,progress) {

            var $target = $(target);

            $loader.css('opacity', '0');

            if(progress==1){

                $target.css({opacity: 1,background:ekolor});
                $target.removeClass("square");
                $target.addClass("circle");
            }else{
               // $loader.css('opacity', '0');
            }


        };

        function functionOver(target) {

            var $target = $(target);

            toggleBorderRadius($target,"circle","square");

        };

        function functionOut(target) {

            var $target = $(target);
            $loader.css('opacity', '0');

            toggleBorderRadius($target,"square","circle");

        };


        function toggleBorderRadius($target,classActive, classInactive){
            if ($target.hasClass(classActive)) {
                $target.css({borderRadius: "0%"});
            } else if ($target.hasClass(classInactive)) {
                $target.css({borderRadius: "50%"});
            }
        }


    });

})();

