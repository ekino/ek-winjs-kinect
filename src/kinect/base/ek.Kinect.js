var EKjs;
(function (EKjs) {
    'use strict';

    /********************
     SINGLETON
     *********************/
    var _forceSingleton = false;
    var _instance = null;
    var _this = null;


    var Kinect = EKjs.Class.extend({


        constructor : function() { // initialize is called by constructor at instanciation.
            _this = this;

            if (!_forceSingleton) {
                throw "Use EKjs.Kinect.getInstance() instead of new EKjs.Kinect() to instanciate the Kinect singleton.";
            }

            //body frame reader
            this.bodyFrame = new EKjs.KinectBodyFrame();

            if (window.WindowsPreview) {

                this.platform = EKjs.Kinect.PLATFORMS.WIN8;

                //initrialize, resume or unload app
                this._checkAppState();

            } else {

                this.platform = EKjs.Kinect.PLATFORMS.WEB;
                this._simulateKinect();
            }

        },


        /********************
         Public variables
         *********************/
        platform: "win8",

        //ek.KinectBodyFrame Class
        bodyFrame: null,

        /********************
         Public methods
         *********************/

        isWin8Platform: function () { return this.platform == EKjs.Kinect.PLATFORMS.WIN8; },

        addCanvasDebug: function (id, onlyTrackedArea, disabledClear) {

            if (!onlyTrackedArea) onlyTrackedArea = false;

            this._debugs[id] = new EKjs.KinectDebug(id);
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

            this._app.onloaded = function () {
                _this._startKinect();
            }

            /*this._app.onactivated = function (args) {
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
             };*/


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
            WinJS.Resources.dispatchEvent(EKjs.Kinect.Events.Application.AVAILABILITY, _this._sensor.isAvailable);
        }





    });


    Kinect.getInstance = function(){
        if (!_instance) {
            _forceSingleton = true;
            _instance = new EKjs.Kinect();
            _forceSingleton = false;
        }

        return _instance;
    }


    Kinect.PLATFORMS =  {
        WIN8: "win8",
        WEB: "web"
    };

    Kinect.Events = {
        Application: {
            AVAILABILITY: "EKjs.Kinect.Events.Application.AVAILABILITY"
        },
        Pointer:{
            MOVE:"EKjs.Kinect.Events.Pointer.MOVE",
                OVER:"EKjs.Kinect.Events.Pointer.OVER",
                OUT:"EKjs.Kinect.Events.Pointer.OUT",
                DOWN:"EKjs.Kinect.Events.Pointer.DOWN",
                UP:"EKjs.Kinect.Events.Pointer.UP",
                HOLD_START:"EKjs.Kinect.Events.Pointer.HOLD_START",
                HOLD_PROGRESS:"EKjs.Kinect.Events.Pointer.HOLD_PROGRESS",
                HOLD_END:"EKjs.Kinect.Events.Pointer.HOLD_END"
        }

    };

    EKjs.Kinect = Kinect;


})(EKjs || (EKjs = {}));
