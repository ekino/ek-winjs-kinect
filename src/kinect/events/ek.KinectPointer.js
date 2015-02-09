(function () {
    'use strict';


    var DELAY_HOLD = 10;
    var TIME_HOLD = 60;
    var COUNT_HOLD = 0;
    var COUNT_DELAY_HOLD = 0;

    /********************
        CONSTRUCTOR 
    *********************/ 
    var constructor = function (body) {
        this._body = body;  
    }
    
    /********************
        INSTANCE DEFINE 
    *********************/ 
    var instanceMembers = {
        /********************
            Public variables 
        *********************/
        name: "",
        x : 0,
        y: 0, 
        appWidth : window.innerWidth,
        appHeight : window.innerHeight,

        /********************
            Public methods 
        *********************/
        addEventListener: function (type, listener, target,settings) {

            var id = "";

            if(target.id && target.id!=""){
                id = target.id;
            }else if(target.className){
                id = target.className;
            }
         
            switch (type) {
                case EkWinjs.Kinect.Events.Pointer.MOVE:
                    this._funcsMove[id] = listener;
                    break;
                case EkWinjs.Kinect.Events.Pointer.OVER:  
                    this._funcsOver[id] = listener;
                    break;
                case EkWinjs.Kinect.Events.Pointer.OUT:
                    this._funcsOut[id] = listener;
                    break;
                case EkWinjs.Kinect.Events.Pointer.UP:
                    this._funcsUp[id] = listener;
                    break;
                case EkWinjs.Kinect.Events.Pointer.DOWN:
                    this._funcsDown[id] = listener;
                    break;
                case EkWinjs.Kinect.Events.Pointer.HOLD_START:
                    this._funcsHoldStart[id] = listener;
                    break;
                case EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS:
                    this._funcsHoldProgress[id] = listener;
                    break;
                case EkWinjs.Kinect.Events.Pointer.HOLD_END:
                    this._funcsHoldEnd[id] = listener;
                    break;
            }

            var forceHandClosed = false;
            if(settings)
            {
                forceHandClosed = settings.handClosed; 
            }
                

            this._targets[id] = { target: target, isOver:false, isHold:false, forceHandClosed:forceHandClosed, holdComplete:false };
          
        
        },  


        removeEventListener : function (type, listener, target) {
        
           var id = "";
           if(target.id && target.id !=""){
                id = target.id;
            }else if(target.className){
                id = target.className;
            }
         

            switch (type) {
                case EkWinjs.Kinect.Events.Pointer.MOVE:
                    this._funcsMove[id] = null;
                    break;
                case EkWinjs.Kinect.Events.Pointer.OVER:
                    this._funcsOver[id] = null;
                    break;
                case EkWinjs.Kinect.Events.Pointer.OUT:
                    this._funcsOut[id] = null;
                    break;
                case EkWinjs.Kinect.Events.Pointer.UP:
                    this._funcsUp[id] = null;
                    break;
                case EkWinjs.Kinect.Events.Pointer.DOWN:
                    this._funcsDown[id] = null;
                    break;
                case EkWinjs.Kinect.Events.Pointer.HOLD_START:
                    this._funcsHoldStart[id] = null;
                    break;
                case EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS:
                    this._funcsHoldProgress[id] = null;
                    break;
                case EkWinjs.Kinect.Events.Pointer.HOLD_END:
                    this._funcsHoldEnd[id] = null;
                    break;
            }
            if (this._targets[id]) {
                this._targets[id] = null;
            }
        },

        render: function(){

            var handValid = this._body.handLeftTracked || this._body.handRightTracked;

            var handClosed = false;
            var handOpen = false;

            if (this._body.isTracked) {

                if (handValid) {

                    if (this._body.handRightTracked && (this._body.rightHand.z < this._body.leftHand.z)) {

                        handClosed = this._body.rightHandClosed;
                        handOpen = this._body.rightHandOpen;

                        this.x = EkWinjs.Kinect.multiplyPixelPoint(this._body.rightHand.x,this.appWidth,this._body.pointMultiplier);
                        this.y = EkWinjs.Kinect.multiplyPixelPoint(this._body.rightHand.y, this.appHeight, this._body.pointMultiplier);
                        
                        
                        handValid = true;

                    } else if (this._body.handLeftTracked) {


                        handClosed = this._body.leftHandClosed;
                        handOpen = this._body.leftHandOpen;


                        this.x = EkWinjs.Kinect.multiplyPixelPoint(this._body.leftHand.x,this.appWidth,this._body.pointMultiplier);
                        this.y = EkWinjs.Kinect.multiplyPixelPoint(this._body.leftHand.y,this.appHeight,this._body.pointMultiplier);

                        handValid = true;

                    }

                    if (handClosed && !this._isDown) {

                        this._renderDownCallbacks();
                        this._isDown = true;

                    } else if (handOpen && this._isDown) {

                        this._renderUpCallbacks();
                        this._isDown = false;
                    }


                    if (!this._userActive) {
                        this._userActive = true;
                    }


                } else {

                    //no interaction with hands
                    if (this._userActive) {

                        this._userActive = false;

                        this._renderUpCallbacks();
                        this._isDown = false;
                    }

                }

                this._renderHoldCallbacks(handClosed);
                this._renderOverOutCallbacks();
                this._renderMoveCallbacks();

            }
                
        },


        startSimulate: function(){

            var _this = this;

            _this._userActive = false;


            document.addEventListener("mousedown", function(event){  

                _this._isDown = true;
                updateMousePosition(event);
                _this._renderDownCallbacks();
            });

            document.addEventListener("mouseup", function(event){  

                _this._isDown = false;
                updateMousePosition(event);
                _this._renderUpCallbacks();
            });


            document.addEventListener("mousemove", function(event){   
                updateMousePosition(event);

                _this._renderMoveCallbacks();
                _this._renderOverOutCallbacks();

                if(!_this._userActive)
                {
                    simulateRender();                    
                    _this._userActive = true;
                }

            });


            function updateMousePosition(event){
                _this.x = event.clientX +  (window.scrollX ? window.scrollX : document.documentElement.scrollLeft);
                _this.y = event.clientY + (window.scrollY ? window.scrollY : document.documentElement.scrollTop);
            }


            function simulateRender(){

                _this._renderHoldCallbacks(_this._isDown);
                window.requestAnimationFrame(simulateRender);

            }




        },


        stopSimulate: function(){            
            cancelAnimationFrame(this.startSimulate);
        },

        /********************
            Private variables 
        *********************/
        _body : null,

        _funcsMove : {},
        _funcsOver : {},
        _funcsOut : {},
        _funcsUp : {},
        _funcsDown : {},
        _funcsHoldStart : {},
        _funcsHoldProgress : {},
        _funcsHoldEnd : {},
        _targets : {},
        _isDown: false,
        _userActive:false,


        /********************
            Private methods 
        *********************/
        //get rectangle area of Html target
        _getRectangle : function (target) {
            var rect = {};

            rect.width = target.offsetWidth;
            rect.height = target.offsetHeight;

            rect.x = 0;
            rect.y = 0;
            var elem = target;
            do {
                if (!isNaN(elem.offsetLeft)) {
                    rect.x += elem.offsetLeft;
                }
                if (!isNaN(elem.offsetTop)) {
                    rect.y += elem.offsetTop;
                }
            } while (elem = elem.offsetParent);

            return rect;

        },
        //check if pointer is over target
        _checkIfIsOver : function(target) {
            var result = false;
            var rect;
            if (target.width && target.x) {
                rect = target;
            } else {
                rect = this._getRectangle(target);
            }

            if (this.x > rect.x && this.x < rect.x + rect.width && this.y > rect.y && this.y < rect.y + rect.height) {
                result = true;
            }
            return result;
        },


        _renderHoldCallbacks : function(userHandClosed) {

            for (var p in this._funcsHoldStart) {

                if (this._funcsHoldStart[p]!=null) {

                    // check if over target
                    if ((this._targets[p] && this._checkIfIsOver(this._targets[p].target))) {
                        
     
                        if (this._targets[p] && (!this._targets[p].forceHandClosed || userHandClosed) && (!this._targets[p].holdComplete)) {

                         
                            if (!this._targets[p].isHold) {

                                if (COUNT_DELAY_HOLD < DELAY_HOLD) {

                                    COUNT_DELAY_HOLD++;

                                } else {


                                    COUNT_DELAY_HOLD = 0;
                                    COUNT_HOLD = 0;

                                    this._targets[p].isHold = true;

                                    if (this._funcsHoldStart[p]) {
                                        this._funcsHoldStart[p](this._targets[p].target,COUNT_HOLD / TIME_HOLD);
                                    }

                                }


                            } else if (this._targets[p].isHold) {
                                if (COUNT_HOLD >= TIME_HOLD) {

                                    COUNT_HOLD = 0;
                                    this._targets[p].holdComplete = true;
                                    this._targets[p].isHold = false;


                                    if (this._funcsHoldEnd[p]) {
                                        this._funcsHoldEnd[p](this._targets[p].target,1);
                                    }

                                } else {
                                    COUNT_HOLD++;

                                    if (this._funcsHoldProgress[p]) {
                                        this._funcsHoldProgress[p](this._targets[p].target,COUNT_HOLD / TIME_HOLD);
                                    }
                                }
                            }
                        }

                    }else {
                        
                        if (this._targets[p] &&  this._targets[p].isHold){

                            COUNT_DELAY_HOLD = 0;
                            COUNT_HOLD = 0;

                            this._targets[p].holdComplete = false;
                            this._targets[p].isHold = false;
                        }
                    }
                }
            }
        },


        _renderOverOutCallbacks : function() {

            var check = false;

            for (var p in this._funcsOver) {
                if (this._funcsOver[p] != null) {

                    if (this._targets[p]) {
                        check = this._checkIfIsOver(this._targets[p].target);
                        // check if over target
                        if (!this._targets[p].isOver && check) {
                            this._targets[p].isOver = true;
                            this._funcsOver[p](this._targets[p].target);
                        }
                    }
                }
            }

            for (var p in this._funcsOut) {
                if (this._funcsOut[p] != null) {
                    if (this._targets[p]) {
                        check = this._checkIfIsOver(this._targets[p].target);


                         if (this._targets[p].isOver && !check) { // check if out target
                            this._targets[p].isOver = false;
                            this._funcsOut[p](this._targets[p].target);
                        }
                    }
                }
            }
        },
        

        _renderMoveCallbacks : function() {
            this._callListenersOnTarget(this._funcsMove);
        },

        _renderUpCallbacks : function() {
            this._callListenersOnTarget(this._funcsUp);
        },

        _renderDownCallbacks : function() {
            this._callListenersOnTarget(this._funcsDown);
        },

        _callListenersOnTarget : function(arrayListeners) {
            for (var p in arrayListeners) {
                if (arrayListeners[p] != null) {
                   
                    // check if over target
                    if (this._targets[p] && (!this._targets[p].target || (this._targets[p].target && this._checkIfIsOver(this._targets[p].target)))) {

                        //call listener
                        arrayListeners[p](this._targets[p].target);
                    }

                }
            }
        },


        _funct: function (type, listener, target, data) {
        },
    };

    /********************
        STATICS 
    *********************/
    var staticMembers = {
        ENUM: "enum",
        funct: function () {
        }
    };


    //class definition
    var Class = WinJS.Class.define(constructor, instanceMembers, staticMembers);

    WinJS.Namespace.define("EkWinjs", {
        KinectPointer: Class
    });

})();


