var EKjs;
(function (EKjs) {
    'use strict';


    var DELAY_HOLD = 10;
    var TIME_HOLD = 60;
    var COUNT_HOLD = 0;
    var COUNT_DELAY_HOLD = 0;


    var KinectPointer = EKjs.Class.extend({


        constructor: function (body) {

            this._body = body;
        },

        /********************
         Public variables
         *********************/
        name: "",
        x: 0,
        y: 0,
        z: 0,
        appWidth: window.innerWidth,
        appHeight: window.innerHeight,

        /********************
         Public methods
         *********************/
        addEventListener: function (type, funct, target, settings) {

            var targetId = this._getTargetId(target);
            var id = this._getListernersId(targetId, funct);

            var forceHandClosed = false;
            if (settings) {
                forceHandClosed = settings.handClosed;
            }

            this._targets[targetId] = {
                target: target,
                isOver: false,
                isHold: false,
                forceHandClosed: forceHandClosed,
                holdComplete: false
            };
            var listener = {targetId: targetId, funct: funct};

            switch (type) {
                case EKjs.Kinect.Events.Pointer.MOVE:
                    this._funcsMove[id] = listener;
                    break;
                case EKjs.Kinect.Events.Pointer.OVER:
                    this._funcsOver[id] = listener;
                    break;
                case EKjs.Kinect.Events.Pointer.OUT:
                    this._funcsOut[id] = listener;
                    break;
                case EKjs.Kinect.Events.Pointer.UP:
                    this._funcsUp[id] = listener;
                    break;
                case EKjs.Kinect.Events.Pointer.DOWN:
                    this._funcsDown[id] = listener;
                    break;
                case EKjs.Kinect.Events.Pointer.HOLD_START:
                    this._funcsHoldStart[id] = listener;
                    break;
                case EKjs.Kinect.Events.Pointer.HOLD_PROGRESS:
                    this._funcsHoldProgress[id] = listener;
                    break;
                case EKjs.Kinect.Events.Pointer.HOLD_END:
                    this._funcsHoldEnd[id] = listener;
                    break;
            }

        },


        removeEventListener: function (type, funct, target) {

            var targetId = this._getTargetId(target);
            var id = this._getListernersId(targetId, funct);

            if (this._targets[targetId]) {
                this._targets[targetId] = null;
            }

            switch (type) {
                case EKjs.Kinect.Events.Pointer.MOVE:
                    this._funcsMove[id] = null;
                    break;
                case EKjs.Kinect.Events.Pointer.OVER:
                    this._funcsOver[id] = null;
                    break;
                case EKjs.Kinect.Events.Pointer.OUT:
                    this._funcsOut[id] = null;
                    break;
                case EKjs.Kinect.Events.Pointer.UP:
                    this._funcsUp[id] = null;
                    break;
                case EKjs.Kinect.Events.Pointer.DOWN:
                    this._funcsDown[id] = null;
                    break;
                case EKjs.Kinect.Events.Pointer.HOLD_START:
                    this._funcsHoldStart[id] = null;
                    break;
                case EKjs.Kinect.Events.Pointer.HOLD_PROGRESS:
                    this._funcsHoldProgress[id] = null;
                    break;
                case EKjs.Kinect.Events.Pointer.HOLD_END:
                    this._funcsHoldEnd[id] = null;
                    break;
            }
        },

        render: function () {

            var handValid = this._body.handLeftTracked || this._body.handRightTracked;

            var handClosed = false;
            var handOpen = false;

            if (this._body.isTracked) {

                if (handValid) {

                    if (this._body.handRightTracked && (this._body.rightHand.z < this._body.leftHand.z)) {

                        handClosed = this._body.rightHandClosed;
                        handOpen = this._body.rightHandOpen;

                        this.x = EKjs.Kinect.multiplyPixelPoint(this._body.rightHand.x, this.appWidth, this._body.pointMultiplier);
                        this.y = EKjs.Kinect.multiplyPixelPoint(this._body.rightHand.y, this.appHeight, this._body.pointMultiplier);


                        handValid = true;

                    } else if (this._body.handLeftTracked) {


                        handClosed = this._body.leftHandClosed;
                        handOpen = this._body.leftHandOpen;


                        this.x = EKjs.Kinect.multiplyPixelPoint(this._body.leftHand.x, this.appWidth, this._body.pointMultiplier);
                        this.y = EKjs.Kinect.multiplyPixelPoint(this._body.leftHand.y, this.appHeight, this._body.pointMultiplier);

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


        startSimulate: function () {

            var _this = this;

            _this._userActive = false;


            document.addEventListener("mousedown", function (event) {

                _this._isDown = true;
                updateMousePosition(event);
                _this._renderDownCallbacks();
            });

            document.addEventListener("mouseup", function (event) {

                _this._isDown = false;
                updateMousePosition(event);
                _this._renderUpCallbacks();
            });


            document.addEventListener("mousemove", function (event) {
                updateMousePosition(event);

                _this._renderMoveCallbacks();
                _this._renderOverOutCallbacks();

                if (!_this._userActive) {
                    simulateRender();
                    _this._userActive = true;
                }

            });

            document.addEventListener("mousewheel", function (event) {

                _this.z += event.wheelDelta;
                _this._renderMoveCallbacks();
            });


            function updateMousePosition(event) {
                _this.x = event.clientX + (window.scrollX ? window.scrollX : document.documentElement.scrollLeft);
                _this.y = event.clientY + (window.scrollY ? window.scrollY : document.documentElement.scrollTop);
            }


            function simulateRender() {

                _this._renderHoldCallbacks(_this._isDown);
                window.requestAnimationFrame(simulateRender);

            }


        },


        stopSimulate: function () {
            window.cancelAnimationFrame(this.startSimulate);
        },

        /********************
         Private variables
         *********************/
        _body: null,

        _funcsMove: {},
        _funcsOver: {},
        _funcsOut: {},
        _funcsUp: {},
        _funcsDown: {},
        _funcsHoldStart: {},
        _funcsHoldProgress: {},
        _funcsHoldEnd: {},
        _targets: {},
        _isDown: false,
        _userActive: false,


        /********************
         Private methods
         *********************/
        _getTargetId: function (target, listener) {
            var id = "";

            if (target.id && target.id != "") {
                id = target.id;
            } else if (target.className) {
                id = target.className;
            }

            return id;
        },

        _getListernersId: function (targetId, listener) {
            var id = targetId + listener.toString();
            return id;
        },

        //get rectangle area of Html target
        _getRectangle: function (target) {
            var rect = {};

            var bounding = target.getBoundingClientRect();
            rect.width = bounding.width;
            rect.height = bounding.height;
            rect.x = bounding.left;
            rect.y = bounding.top;

            return rect;

        },

        _isOverTarget: function (idTarget) {
            return (this._targets[idTarget] && this._checkIfIsOver(this._targets[idTarget].target));
        },

        //check if pointer is over target
        _checkIfIsOver: function (target) {
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


        _renderHoldCallbacks: function (userHandClosed) {


            //check hold start listeners
            for (var p in this._funcsHoldStart) {

                if (this._funcsHoldStart[p] != null) {

                    var idTarget = this._funcsHoldStart[p].targetId;

                    if (this._isOverTarget(idTarget)) {

                        if (this._handIsClosedOnTarget(idTarget, userHandClosed)) {

                            if (!this._targets[idTarget].isHold) {

                                if (COUNT_DELAY_HOLD < DELAY_HOLD) {

                                    COUNT_DELAY_HOLD++;
                                } else {

                                    COUNT_DELAY_HOLD = 0;
                                    COUNT_HOLD = 0;

                                    this._targets[idTarget].isHold = true;

                                    if (this._funcsHoldStart[p]) {
                                        this._funcsHoldStart[p].funct(this._targets[idTarget].target, COUNT_HOLD / TIME_HOLD);
                                    }

                                }

                            }

                        }

                    } else {

                        if (this._targets[idTarget] && this._targets[idTarget].isHold) {

                            COUNT_DELAY_HOLD = 0;
                            COUNT_HOLD = 0;

                            this._targets[idTarget].holdComplete = false;
                            this._targets[idTarget].isHold = false;
                        }
                    }
                }
            }

            //check hold progress listeners
            for (var p in this._funcsHoldProgress) {

                var idTarget = this._funcsHoldProgress[p].targetId;

                if (this._isOverTarget(idTarget)) {
                    if (this._targets[idTarget].isHold && this._handIsClosedOnTarget(idTarget, userHandClosed)) {
                        if (COUNT_HOLD < TIME_HOLD) {

                            COUNT_HOLD++;

                            if (this._funcsHoldProgress[p]) {
                                this._funcsHoldProgress[p].funct(this._targets[idTarget].target, COUNT_HOLD / TIME_HOLD);
                            }
                        }
                    }
                }

            }

            //check hold end listeners
            for (var p in this._funcsHoldEnd) {

                var idTarget = this._funcsHoldEnd[p].targetId;

                if (this._isOverTarget(idTarget)) {
                    if (this._targets[idTarget].isHold && !this._handIsClosedOnTarget(idTarget, userHandClosed)) {
                        if (COUNT_HOLD >= TIME_HOLD) {

                            COUNT_HOLD = 0;
                            this._targets[idTarget].holdComplete = true;
                            this._targets[idTarget].isHold = false;


                            if (this._funcsHoldEnd[p]) {
                                this._funcsHoldEnd[p].funct(this._targets[idTarget].target, 1);
                            }

                        }
                    }
                }

            }


        },


        _renderOverOutCallbacks: function () {

            var check = false;

            for (var p in this._funcsOver) {
                if (this._funcsOver[p] != null) {

                    var idTarget = this._funcsOver[p].targetId;


                    if (this._targets[idTarget]) {

                        check = this._checkIfIsOver(this._targets[idTarget].target);
                        // check if over target
                        if (!this._targets[idTarget].isOver && check) {
                            this._targets[idTarget].isOver = true;
                            this._funcsOver[p].funct(this._targets[idTarget].target);
                        }
                    }
                }
            }

            for (var p in this._funcsOut) {
                if (this._funcsOut[p] != null) {

                    var idTarget = this._funcsOut[p].targetId;

                    if (this._targets[idTarget]) {

                        check = this._checkIfIsOver(this._targets[idTarget].target);


                        if (this._targets[idTarget].isOver && !check) { // check if out target
                            this._targets[idTarget].isOver = false;
                            this._funcsOut[p].funct(this._targets[idTarget].target);
                        }
                    }
                }
            }
        },


        _renderMoveCallbacks: function () {
            this._callListenersOnTarget(this._funcsMove);
        },

        _renderUpCallbacks: function () {
            this._callListenersOnTarget(this._funcsUp);
        },

        _renderDownCallbacks: function () {
            this._callListenersOnTarget(this._funcsDown);
        },

        _callListenersOnTarget: function (arrayListeners) {
            for (var p in arrayListeners) {
                if (arrayListeners[p] != null) {

                    var idTarget = arrayListeners[p].targetId;

                    // check if over target
                    if (this._targets[idTarget] && (!this._targets[idTarget].target || (this._targets[idTarget].target && this._checkIfIsOver(this._targets[idTarget].target)))) {

                        //call listener
                        arrayListeners[p].funct(this._targets[idTarget].target);
                    }

                }
            }
        },


        _handIsClosedOnTarget: function (idTarget, userHandClosed) {
            return (this._targets[idTarget] && (!this._targets[idTarget].forceHandClosed || userHandClosed) && (!this._targets[idTarget].holdComplete));
        }
    });


    EKjs.KinectPointer = KinectPointer;


})(EKjs || (EKjs = {}));



