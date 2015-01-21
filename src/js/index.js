var kinect = EkWinjs.Kinect.getInstance();

var body = kinect.bodyFrame.trackBodyOn(0.5, 0.2, 1.5, 0.1);


var tiles = document.getElementsByClassName("element");

for (var i = tiles.length - 1; i >= 0; i--) {
  console.log(tiles[i]);

  //body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OVER, functionOver,tiles[i]);

  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_START, functionHoldStart,tiles[i],{handClosed:false});
  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS, functionHoldProgress,tiles[i],{handClosed:false});
  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_END, functionHoldEnd,tiles[i],{handClosed:false});

  //body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler,tiles[i]);
};


function functionMoveHandler(target) {
    console.log("functionMoveHandler Handler ",target);
};

function functionHoldStart(target) {
    console.log("functionHoldStart Handler ",target);
};

function functionHoldProgress(target,progress) {
    console.log("functionHoldProgress Handler ",target,progress);
};

function functionHoldEnd(target) {
    console.log("functionHoldEnd Handler ",target);
};

function functionOver(target) {
   console.log("functionOver Handler ",target);
};