(function () {
    'use strict';


    /********************
        SINGLETON 
    *********************/
    var _forceSingleton = false;
    var _instance = null;

    var _this = null;


    /********************
        CONSTRUCTOR 
    *********************/
    var constructor = function () {

        _this = this;

        if (!_forceSingleton) {
            throw "Use EkWinjs.Kinect.getInstance() instead of new EkWinjs.Kinect() to instanciate the Kinect singleton.";
        }

        //body frame reader
        this.bodyFrame = new EkWinjs.KinectBodyFrame();

        if (window.WindowsPreview) {

            this.platform = EkWinjs.Kinect.PLATFORMS.WIN8;

            //initrialize, resume or unload app
            this._checkAppState();

        } else {

            this.platform = EkWinjs.Kinect.PLATFORMS.WEB;
            this._simulateKinect();
        }


    };


    /********************
        INSTANCE DEFINE 
    *********************/
    var instanceMembers = {


        /********************
            Public variables 
        *********************/
        platform: "win8",

        //ek.KinectBodyFrame Class
        bodyFrame: null,

        /********************
            Public methods 
        *********************/
        
        isWin8Platform: function () { return this.platform == EkWinjs.Kinect.PLATFORMS.WIN8; },

        addCanvasDebug: function (id, onlyTrackedArea, disabledClear) {

            if (!onlyTrackedArea) onlyTrackedArea = false;

            this._debugs[id] = new EkWinjs.KinectDebug(id);
            this._debugs[id].onlySelected = onlyTrackedArea;
            this._debugs[id].disabledClear = disabledClear;


            if (this._frameDesc) {
                this._debugs[id].setSize(this._frameDesc.width, this._frameDesc.height);
            }

            if (this.bodyFrame) this.bodyFrame.setDebugs(this._debugs);

        },


        removeCanvasDebug: function (id) {
            delete this._debugs[id];
        },

        /********************
            Private variables 
        *********************/
        _app: null,
        _activation: null,
        _kinect: null,
        _sensor: null,
        _frameDesc: null,
        _debugs: {},
        _autoMultiplier: 1,


        /********************
            Private methods 
        *********************/

        _startKinect: function () {

            this._kinect = window.WindowsPreview.Kinect;
            this._sensor = this._kinect.KinectSensor.getDefault();

            this._frameDesc = this._sensor.bodyIndexFrameSource.frameDescription;
            this.bodyFrame.setFrameSize(this._frameDesc.width, this._frameDesc.height);

            this.bodyFrame.start(this._sensor.bodyFrameSource, this._kinect.JointType, this._kinect.Body.jointCount);

            this._sensor.addEventListener("isavailablechanged", this._sensor_IsAvailableChanged);

            this._sensor.open();

        },

        _simulateKinect: function () {
            this.bodyFrame.startSimulate();
        },


        _checkAppState: function () {

            this._app = WinJS.Application;
            this._activation = Windows.ApplicationModel.Activation;
            this._app.start();

            this._app.onactivated = function (args) {
                if (args.detail.kind === _this._activation.ActivationKind.launch) {
                    if (args.detail.previousExecutionState !== _this._activation.ApplicationExecutionState.terminated) {

                        //application constructorialize here
                        _this._startKinect();

                    } else {
                        // TODO: This application has been reactivated from suspension.
                        // Restore application state here.
                    }

                    args.setPromise(WinJS.UI.processAll());
                }
            };


            this._app.onunload = function (args) {

                if (this.bodyFrame) {
                    this.bodyFrame.close();
                }

                if (this._sensor != null) {
                    this._sensor.close();
                }
            }
        },

        /********************
            Events 
        *********************/

        _sensor_IsAvailableChanged: function (args) {
            WinJS.Resources.dispatchEvent(EkWinjs.Kinect.Events.Application.AVAILABILITY, _this._sensor.isAvailable);
        }



    };

    /********************
        STATICS 
    *********************/
    var staticMembers = {

        //enums
        PLATFORMS: {
            WIN8: "win8",
            WEB: "web"
        },

        Events: {
            Application: {
                 AVAILABILITY: "EkWinjs.Kinect.Events.Application.AVAILABILITY"
            },
            Pointer:{
                MOVE:"EkWinjs.Kinect.Events.Pointer.MOVE",
                CLICK:"EkWinjs.Kinect.Events.Pointer.CLICK",
                OVER:"EkWinjs.Kinect.Events.Pointer.OVER",
                OUT:"EkWinjs.Kinect.Events.Pointer.OUT",
                DOWN:"EkWinjs.Kinect.Events.Pointer.DOWN",
                UP:"EkWinjs.Kinect.Events.Pointer.UP",
                HOLD_START:"EkWinjs.Kinect.Events.Pointer.HOLD_START",
                HOLD_PROGRESS:"EkWinjs.Kinect.Events.Pointer.HOLD_PROGRESS",
                HOLD_END:"EkWinjs.Kinect.Events.Pointer.HOLD_END"
            },
   
        },

        //methods
        getInstance: function () {

            if (!_instance) {
                _forceSingleton = true;
                _instance = new EkWinjs.Kinect();
                _forceSingleton = false;
            }

            return _instance;

        },

           // if (!multiplier) multiplier = _this._autoMultiplier;
        multiplyPixelPoint: function (positionValue, allPixelsValue, multiplier) {
            var newWidth = allPixelsValue * multiplier;
            var diff = (newWidth - allPixelsValue) * 0.5;
            return (positionValue * newWidth) - diff;
        },


    };


    //WinJs class defconstructorion
    var Class = WinJS.Class.define(constructor, instanceMembers, staticMembers);

    WinJS.Namespace.define("EkWinjs", {
        Kinect: Class
    });



})();



