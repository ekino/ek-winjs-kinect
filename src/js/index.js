var kinect = EkWinjs.Kinect.getInstance();



var body = kinect.bodyFrame.trackBodyOn(0.5, 0.2, 1.5, 0.2);


kinect.addCanvasDebug("mainCanvas");

kinect.addCanvasDebug("resultCanvas", true);


var tiles = document.getElementsByClassName("element");

for (var i = tiles.length - 1; i >= 0; i--) {
  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OVER, functionOver,tiles[i]);
  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.OUT, functionOut,tiles[i]);
  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_START, functionHoldStart,tiles[i],{handClosed:true});
  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS, functionHoldProgress,tiles[i],{handClosed:true});
  body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.HOLD_END, functionHoldEnd,tiles[i],{handClosed:true});
};

body.pointer.addEventListener(EkWinjs.Kinect.Events.Pointer.MOVE, functionMoveHandler, document.body);

function functionMoveHandler(target) {
    console.log(body.pointer.x);
};

function functionHoldStart(target) {
    ekolor = ekolors[Math.floor(Math.random() * ekolors.length)];
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

  if (progress >= 1) {
    //$('.loader').css('opacity', '0');
  }
};

function functionHoldEnd(target) {
  target.style.opacity = 1;
  removeClass(target, "square");
  addClass(target, "circle");
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
  if (hasClass(target,"square")) {
   target.style.borderRadius = "0%";
  } else if (hasClass(target,"circle")) {
   target.style.borderRadius = "50%";
  }
};  


/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////


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
]

function hasClass(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

$(".loader--inpt").knob({
  'min':0,
  'max':100,
  'width':50,
  'thickness':0.2,
  'fgColor':"#FF4611",
  'displayInput':'false'
});