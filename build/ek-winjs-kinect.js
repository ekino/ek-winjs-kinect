var EKjs;
(function (EKjs) {
    'use strict';

    var Class = function() {
        this.constructor && this.constructor.apply(this, arguments);
    };

    Class.extend = function(childPrototype) { // defining a static method 'extend'
        var parent = this;
        var child = function() { // the child constructor is a call to its parent's
            return parent.apply(this, arguments);
        };
        child.extend = parent.extend; // adding the extend method to the child class
        var Surrogate = function() {}; // surrogate "trick" as seen previously
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
        for(var key in childPrototype){
            child.prototype[key] = childPrototype[key];
        }
        return child; // returning the child class
    };


    EKjs.Class = Class;

    EKjs.VERSION ="alpha_0.0.2";


})(EKjs || (EKjs = {}));

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

var EKjs;
(function (EKjs) {
    'use strict';


    var KinectBodyData = EKjs.Class.extend({


        constructor: function () {
            this.pointer = new EKjs.KinectPointer(this);
        },


        /********************
         Public variables
         *********************/

        id: 0,

        pointer: undefined,

        pointMultiplier: 1,

        trackArea: {
            x: 0.5,
            z: 1,
            dephX: 0.2,
            dephZ: 0.1,
            handPushZ: 0.20
        },

        //hand
        rightHand: {x: 0, y: 0, z: 0},
        leftHand: {x: 0, y: 0, z: 0},

        //torso
        head: {x: 0, y: 0, z: 0},
        neck: {x: 0, y: 0, z: 0},
        spineShoulder: {x: 0, y: 0, z: 0},
        spineMid: {x: 0, y: 0, z: 0},
        spineBase: {x: 0, y: 0, z: 0},

        //right arm
        shoulderRight: {x: 0, y: 0, z: 0},
        elbowRight: {x: 0, y: 0, z: 0},
        wristRight: {x: 0, y: 0, z: 0},
        handTipRight: {x: 0, y: 0, z: 0},
        thumbRight: {x: 0, y: 0, z: 0},

        //left arm
        shoulderLeft: {x: 0, y: 0, z: 0},
        elbowLeft: {x: 0, y: 0, z: 0},
        handTipLeft: {x: 0, y: 0, z: 0},
        thumbLeft: {x: 0, y: 0, z: 0},
        wristLeft: {x: 0, y: 0, z: 0},

        //right leg
        hipRight: {x: 0, y: 0, z: 0},
        kneeRight: {x: 0, y: 0, z: 0},
        ankleRight: {x: 0, y: 0, z: 0},
        footRight: {x: 0, y: 0, z: 0},

        //left leg
        hipLeft: {x: 0, y: 0, z: 0},
        kneeLeft: {x: 0, y: 0, z: 0},
        ankleLeft: {x: 0, y: 0, z: 0},
        footLeft: {x: 0, y: 0, z: 0},


        isTracked: false,
        handLeftTracked: false,
        handRightTracked: false,


        /********************
         Public methods
         *********************/
        render: function () {
            this.pointer.render();
        },

        startSimulate: function () {

            this.pointer.startSimulate();
        },

        stopSimulate: function () {
            this.pointer.stopSimulate();
        }

    });


    EKjs.KinectBodyData = KinectBodyData;


})(EKjs || (EKjs = {}));






var EKjs;
(function (EKjs) {
    'use strict';

    var _this = null;
    var _needSimulation = null;

    var KinectBodyFrame = EKjs.Class.extend({


        constructor: function () {

            _this = this;

        },


        /********************
         Public methods
         *********************/
        setDebugs: function (debug) {
            this._debugs = debug;
        },

        trackBodyOn: function (x, dephX, z, dephZ) {

            _this._selectedBody = new EKjs.KinectBodyData();
            _this._selectedBody.trackArea.x = x;
            _this._selectedBody.trackArea.z = z;
            _this._selectedBody.trackArea.dephX = dephX;
            _this._selectedBody.trackArea.dephZ = dephZ;

            if (_needSimulation) {
                _this._selectedBody.startSimulate();
            }

            return _this._selectedBody;
        },


        getSelectedBody: function () {
            return _this._selectedBody;
        },

        /**

         */
        getPixelPoint: function (positionValue, allPixelsValue, multiplier) {
            if (!multiplier) multiplier = _this._autoMultiplier;

            var newWidth = allPixelsValue * multiplier;
            var diff = (newWidth - allPixelsValue) * 0.5;
            return (positionValue * newWidth) - diff;
        },

        setFrameSize: function (width, height) {
            this._frameWidth = width;
            this._frameHeight = height;
        },

        start: function (bodyFrameSource, JointType, jointCount) {

            this._bodyFrameReader = bodyFrameSource.openReader();
            this._bodyImageProcessor = KinectImageProcessor.BodyHelper;
            this._bodies = new Array(bodyFrameSource.bodyCount);

            this._JointType = JointType;
            this._jointCount = jointCount;

            this._bones = this._populateBones();

            this._bodyFrameReader.addEventListener("framearrived", this._reader_BodyFrameArrived);

        },

        startSimulate: function () {

            _needSimulation = true;

            if (_this._selectedBody) {
                _this._selectedBody.startSimulate();
            }

        },

        stopSimulate: function () {

            _needSimulation = false;

            if (_this._selectedBody) {
                _this._selectedBody.stopSimulate();
            }
        },

        close: function () {

            if (this._bodyFrameReader) this._bodyFrameReader.removeEventListener("framearrived", this._reader_BodyFrameArrived);

            this._bodyFrameReader = null;
        },


        /********************
         Private variables
         *********************/
        _bodyFrameReader: null,
        _bodyImageProcessor: null,

        _bodies: null,
        _bones: null,
        _JointType: null,
        _jointCount: null,
        _frameWidth: 0,
        _frameHeight: 0,

        _selectedBody: null,
        _debugs: null,


        /********************
         Private methods
         *********************/


        // Create array of bones
        _populateBones: function () {
            var bones = new Array();

            var jointType = window.WindowsPreview.Kinect.JointType;

            // torso
            bones.push({jointStart: jointType.head, jointEnd: jointType.neck});
            bones.push({jointStart: jointType.neck, jointEnd: jointType.spineShoulder});
            bones.push({jointStart: jointType.spineShoulder, jointEnd: jointType.spineMid});
            bones.push({jointStart: jointType.spineMid, jointEnd: jointType.spineBase});
            bones.push({jointStart: jointType.spineShoulder, jointEnd: jointType.shoulderRight});
            bones.push({jointStart: jointType.spineShoulder, jointEnd: jointType.shoulderLeft});
            bones.push({jointStart: jointType.spineBase, jointEnd: jointType.hipRight});
            bones.push({jointStart: jointType.spineBase, jointEnd: jointType.hipLeft});

            // right arm
            bones.push({jointStart: jointType.shoulderRight, jointEnd: jointType.elbowRight});
            bones.push({jointStart: jointType.elbowRight, jointEnd: jointType.wristRight});
            bones.push({jointStart: jointType.wristRight, jointEnd: jointType.handRight});
            bones.push({jointStart: jointType.handRight, jointEnd: jointType.handTipRight});
            bones.push({jointStart: jointType.wristRight, jointEnd: jointType.thumbRight});

            // left arm
            bones.push({jointStart: jointType.shoulderLeft, jointEnd: jointType.elbowLeft});
            bones.push({jointStart: jointType.elbowLeft, jointEnd: jointType.wristLeft});
            bones.push({jointStart: jointType.wristLeft, jointEnd: jointType.handLeft});
            bones.push({jointStart: jointType.handLeft, jointEnd: jointType.handTipLeft});
            bones.push({jointStart: jointType.wristLeft, jointEnd: jointType.thumbLeft});

            // right leg
            bones.push({jointStart: jointType.hipRight, jointEnd: jointType.kneeRight});
            bones.push({jointStart: jointType.kneeRight, jointEnd: jointType.ankleRight});
            bones.push({jointStart: jointType.ankleRight, jointEnd: jointType.footRight});

            // left leg
            bones.push({jointStart: jointType.hipLeft, jointEnd: jointType.kneeLeft});
            bones.push({jointStart: jointType.kneeLeft, jointEnd: jointType.ankleLeft});
            bones.push({jointStart: jointType.ankleLeft, jointEnd: jointType.footLeft});

            return bones;
        },


        _targetSelectedBody: function (jointPoints) {

            var isInTarget = false;

            if (this._selectedBody && this._selectedBody.trackArea) {
                var jointType = window.WindowsPreview.Kinect.JointType;

                var posX = jointPoints[jointType.spineBase].position.x / this._frameWidth;
                var posZ = jointPoints[jointType.spineBase].position.z;

                var targetX = this._selectedBody.trackArea.x;
                var targetZ = this._selectedBody.trackArea.z;

                var dephX = this._selectedBody.trackArea.dephX;
                var dephZ = this._selectedBody.trackArea.dephZ;

                var startX = targetX - dephX;
                var endX = targetX + dephX;
                var startZ = targetZ - dephZ;
                var endZ = targetZ + dephZ;

                if (posX > startX && posX < endX && posZ > startZ && posZ < endZ) {
                    isInTarget = true;
                }
            }


            return isInTarget;
        },


        _populateBodyDatas: function (body, bodyIndex, jointPoints) {


            if (_this._selectedBody) {

                _this._selectedBody.id = bodyIndex;

                var torsoHeight = jointPoints[_this._JointType.spineBase].position.y - jointPoints[_this._JointType.head].position.y;
                var PUSH_Z_ACTIVE = _this._selectedBody.trackArea.handPushZ;

                //set multiplier variable to auto-size the position of the body in space
                _this._selectedBody.pointMultiplier = 1 / (torsoHeight / _this._frameHeight) * 1.5;

                var handLeftPosition = jointPoints[_this._JointType.handLeft].position;
                var handRightPosition = jointPoints[_this._JointType.handRight].position;
                var headPosition = jointPoints[_this._JointType.head].position;

                //get hand position only on hand right up and push on front of head
                if (handRightPosition.y < jointPoints[_this._JointType.spineBase].position.y
                    && (headPosition.z - handRightPosition.z) > PUSH_Z_ACTIVE) {

                    _this._selectedBody.rightHandClosed = (body.handRightState == WindowsPreview.Kinect.HandState.closed);
                    _this._selectedBody.rightHandOpen = (body.handRightState == WindowsPreview.Kinect.HandState.open);

                    _this._fillRawBodyPoint(_this._selectedBody.rightHand, handRightPosition);

                    _this._selectedBody.handRightTracked = true;
                } else {
                    _this._selectedBody.handRightTracked = false;
                }

                //get hand position only on hand left up and push on front of head
                if (handLeftPosition.y < jointPoints[_this._JointType.spineBase].position.y
                    && (headPosition.z - handLeftPosition.z) > PUSH_Z_ACTIVE) {

                    _this._selectedBody.leftHandClosed = (body.handLeftState == WindowsPreview.Kinect.HandState.closed);
                    _this._selectedBody.leftHandOpen = (body.handLeftState == WindowsPreview.Kinect.HandState.open);

                    _this._fillRawBodyPoint(_this._selectedBody.leftHand, handLeftPosition);


                    _this._selectedBody.handLeftTracked = true;
                } else {
                    _this._selectedBody.handLeftTracked = false;
                }

                _this._fillRawBodyPoint(_this._selectedBody.head, headPosition);
                _this._fillRawBodyPoint(_this._selectedBody.neck, jointPoints[_this._JointType.neck]);
                _this._fillRawBodyPoint(_this._selectedBody.spineShoulder, jointPoints[_this._JointType.spineShoulder]);
                _this._fillRawBodyPoint(_this._selectedBody.spineMid, jointPoints[_this._JointType.spineMid]);
                _this._fillRawBodyPoint(_this._selectedBody.spineBase, jointPoints[_this._JointType.spineBase]);
                _this._fillRawBodyPoint(_this._selectedBody.shoulderRight, jointPoints[_this._JointType.shoulderRight]);
                _this._fillRawBodyPoint(_this._selectedBody.elbowRight, jointPoints[_this._JointType.elbowRight]);
                _this._fillRawBodyPoint(_this._selectedBody.wristRight, jointPoints[_this._JointType.wristRight]);
                _this._fillRawBodyPoint(_this._selectedBody.handTipRight, jointPoints[_this._JointType.handTipRight]);
                _this._fillRawBodyPoint(_this._selectedBody.handTipLeft, jointPoints[_this._JointType.handTipLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.thumbRight, jointPoints[_this._JointType.thumbRight]);
                _this._fillRawBodyPoint(_this._selectedBody.shoulderLeft, jointPoints[_this._JointType.shoulderLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.elbowLeft, jointPoints[_this._JointType.elbowLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.thumbLeft, jointPoints[_this._JointType.thumbLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.wristLeft, jointPoints[_this._JointType.wristLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.hipRight, jointPoints[_this._JointType.hipRight]);
                _this._fillRawBodyPoint(_this._selectedBody.kneeRight, jointPoints[_this._JointType.kneeRight]);
                _this._fillRawBodyPoint(_this._selectedBody.ankleRight, jointPoints[_this._JointType.ankleRight]);
                _this._fillRawBodyPoint(_this._selectedBody.footRight, jointPoints[_this._JointType.footRight]);
                _this._fillRawBodyPoint(_this._selectedBody.hipLeft, jointPoints[_this._JointType.hipLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.kneeLeft, jointPoints[_this._JointType.kneeLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.ankleLeft, jointPoints[_this._JointType.ankleLeft]);
                _this._fillRawBodyPoint(_this._selectedBody.footLeft, jointPoints[_this._JointType.footLeft]);

                _this._selectedBody.isTracked = true;

                _this._selectedBody.render();
            }


        },


        _fillRawBodyPoint: function (position, joint) {
            position.x = joint.x / _this._frameWidth;
            position.y = joint.y / _this._frameHeight;
            position.z = joint.z;
        },

        _createJointPoints: function () {
            var jointPoints = new Array();

            for (var i = 0; i < this._jointCount; ++i) {
                jointPoints.push({joint: 0, x: 0.5, y: 0.5, z: 0});
            }

            return jointPoints;
        },


        /********************
         Events
         *********************/
        _reader_BodyFrameArrived: function (args) {

            // get body frame
            var bodyFrame = args.frameReference.acquireFrame();
            var dataReceived = false;

            if (bodyFrame != null) {
                // got a body, update body data
                bodyFrame.getAndRefreshBodyData(_this._bodies);
                dataReceived = true;
                bodyFrame.close();
            }


            if (dataReceived) {


                //clear debug
                if (_this._debugs) {
                    for (var id in _this._debugs) {
                        if (!_this._debugs[id].disabledClear) _this._debugs[id].clearCanvas();
                    }
                }

                // iterate through each body
                for (var bodyIndex = 0; bodyIndex < _this._bodies.length; ++bodyIndex) {
                    var body = _this._bodies[bodyIndex];

                    // look for tracked bodies
                    if (body.isTracked) {
                        // get joints collection
                        var joints = body.joints;
                        // allocate space for storing joint locations
                        var jointPoints = _this._createJointPoints();

                        // call native component to map all joint locations to depth space
                        if (_this._bodyImageProcessor.processJointLocations(joints, jointPoints)) {

                            var isInTarget = _this._targetSelectedBody(jointPoints);

                            if (isInTarget) {
                                _this._populateBodyDatas(body, bodyIndex, jointPoints);
                            }


                            //debug
                            if (_this._debugs) {
                                for (var id in _this._debugs) {
                                    if (!_this._debugs[id].onlySelected || isInTarget) {
                                        _this._debugs[id].drawBody(body, jointPoints, bodyIndex, body.clippedEdges, _this._bones);
                                    }
                                }
                            }

                        }


                    }
                }

            }

        }


    });

    EKjs.KinectBodyFrame = KinectBodyFrame;


})(EKjs || (EKjs = {}));




var EKjs;
(function (EKjs) {
    'use strict';

    /********************
     ENUM
     *********************/

    // handstate circle size
    var HANDSIZE = 20;

    // tracked bone line thickness
    var TRACKEDBONETHICKNESS = 4;

    // inferred bone line thickness
    var INFERREDBONETHICKNESS = 1;

    // thickness of joints
    var JOINTTHICKNESS = 3;

    // thickness of clipped edges
    var CLIPBOUNDSTHICKNESS = 5;

    // closed hand state color
    var HANDCLOSEDCOLOR = "red";

    // open hand state color
    var HANDOPENCOLOR = "green";

    // lasso hand state color
    var HANDLASSOCOLOR = "blue";

    // tracked joint color
    var TRACKEDJOINTCOLOR = "green";

    // inferred joint color
    var INFERREDJOINTCOLOR = "yellow";


    var KinectDebug = EKjs.Class.extend({


        constructor: function (id) {

            this.id = id;
            this._bodyCanvas = document.getElementById(id);
            this._bodyContext = this._bodyCanvas.getContext("2d");

            this._bodyColors = [
                "#FF4611",
                "#3A5CAC",
                "#8CB7E8",
                "#FFB718",
                "#DC0031",
                "#00ADBB"
            ];

        },


        /********************
         Public variables
         *********************/

        id: null,

        onlySelected: false,

        disabledClear: false,

        /********************
         Public methods
         *********************/

        setSize: function (width, height) {
            this._bodyCanvas.width = width;
            this._bodyCanvas.height = height;
        },
        clearCanvas: function () {
            // clear canvas before drawing each frame
            this._bodyContext.clearRect(0, 0, this._bodyCanvas.width, this._bodyCanvas.height);
        },

        drawBody: function (body, jointPoints, bodyIndex, clippedEdges, bones) {

            // draw the body
            this._drawBodyJoints(body.joints, jointPoints, this._bodyColors[bodyIndex], bones);

            // draw handstate circles
            this._updateHandState(body.handLeftState, jointPoints[window.WindowsPreview.Kinect.JointType.handLeft]);
            this._updateHandState(body.handRightState, jointPoints[window.WindowsPreview.Kinect.JointType.handRight]);

            // draw clipped edges if any
            this._drawClippedEdges(clippedEdges);

        },

        /********************
         Private variables
         *********************/

        _bodyCanvas: null,
        _bodyContext: null,

        // defines a different color for each body
        _bodyColors: null,

        // total number of joints = 25
        _jointCount: null,


        /********************
         Private methods
         *********************/

        _drawBodyJoints: function (joints, jointPoints, bodyColor, bones) {
            // draw all this._bones
            var boneCount = bones.length;
            for (var boneIndex = 0; boneIndex < boneCount; ++boneIndex) {

                var boneStart = bones[boneIndex].jointStart;
                var boneEnd = bones[boneIndex].jointEnd;

                var joint0 = joints.lookup(boneStart);
                var joint1 = joints.lookup(boneEnd);

                // don't do anything if either joint is not tracked
                if ((joint0.trackingState == window.WindowsPreview.Kinect.TrackingState.notTracked) ||
                    (joint1.trackingState == window.WindowsPreview.Kinect.TrackingState.notTracked)) {
                    return;
                }

                // all bone lines are inferred thickness unless both joints are tracked
                var boneThickness = INFERREDBONETHICKNESS;
                if ((joint0.trackingState == window.WindowsPreview.Kinect.TrackingState.tracked) &&
                    (joint1.trackingState == window.WindowsPreview.Kinect.TrackingState.tracked)) {
                    boneThickness = TRACKEDBONETHICKNESS;
                }

                this._drawBone(jointPoints[boneStart], jointPoints[boneEnd], boneThickness, bodyColor);
            }

            // draw all joints
            var jointColor = null;
            for (var jointIndex = 0; jointIndex < this._jointCount; ++jointIndex) {
                var trackingState = joints.lookup(jointIndex).trackingState;

                // only draw if joint is tracked or inferred
                if (trackingState == kinect.TrackingState.tracked) {
                    jointColor = TRACKEDJOINTCOLOR;
                }
                else if (trackingState == kinect.TrackingState.inferred) {
                    jointColor = INFERREDJOINTCOLOR;
                }

                if (jointColor != null) {
                    this._drawJoint(jointPoints[jointIndex], jointColor);
                }
            }
        },

        _drawHand: function (jointPoint, handColor) {
            // draw semi transparent hand cicles
            this._bodyContext.globalAlpha = 0.75;
            this._bodyContext.beginPath();
            this._bodyContext.fillStyle = handColor;
            this._bodyContext.arc(jointPoint.x, jointPoint.y, HANDSIZE, 0, Math.PI * 2, true);
            this._bodyContext.fill();
            this._bodyContext.closePath();
            this._bodyContext.globalAlpha = 1;
        },

        // Draw a joint circle on canvas
        _drawJoint: function (joint, jointColor) {
            this._bodyContext.beginPath();
            this._bodyContext.fillStyle = jointColor;
            this._bodyContext.arc(joint.position.x, joint.position.y, JOINTTHICKNESS, 0, Math.PI * 2, true);
            this._bodyContext.fill();
            this._bodyContext.closePath();
        },

        // Draw a bone line on canvas
        _drawBone: function (startPoint, endPoint, boneThickness, boneColor) {
            this._bodyContext.beginPath();
            this._bodyContext.strokeStyle = boneColor;
            this._bodyContext.lineWidth = boneThickness;
            this._bodyContext.moveTo(startPoint.position.x, startPoint.position.y);
            this._bodyContext.lineTo(endPoint.position.x, endPoint.position.y);
            this._bodyContext.stroke();
            this._bodyContext.closePath();
        },

        // Determine hand state
        _updateHandState: function (handState, jointPoint) {
            switch (handState) {
                case window.WindowsPreview.Kinect.HandState.closed:
                    this._drawHand(jointPoint, HANDCLOSEDCOLOR);
                    break;

                case window.WindowsPreview.Kinect.HandState.open:
                    this._drawHand(jointPoint, HANDOPENCOLOR);
                    break;

                case window.WindowsPreview.Kinect.HandState.lasso:
                    this._drawHand(jointPoint, HANDLASSOCOLOR);
                    break;
            }
        },

        // Draws clipped edges
        _drawClippedEdges: function (clippedEdges) {

            this._bodyContext.fillStyle = "red";

            if (this._hasClippedEdges(clippedEdges, window.WindowsPreview.Kinect.FrameEdges.bottom)) {
                this._bodyContext.fillRect(0, this._bodyCanvas.height - CLIPBOUNDSTHICKNESS, this._bodyCanvas.width, CLIPBOUNDSTHICKNESS);
            }

            if (this._hasClippedEdges(clippedEdges, window.WindowsPreview.Kinect.FrameEdges.top)) {
                this._bodyContext.fillRect(0, 0, this._bodyCanvas.width, CLIPBOUNDSTHICKNESS);
            }

            if (this._hasClippedEdges(clippedEdges, window.WindowsPreview.Kinect.FrameEdges.left)) {
                this._bodyContext.fillRect(0, 0, CLIPBOUNDSTHICKNESS, this._bodyCanvas.height);
            }

            if (this._hasClippedEdges(clippedEdges, window.WindowsPreview.Kinect.FrameEdges.right)) {
                this._bodyContext.fillRect(this._bodyCanvas.width - CLIPBOUNDSTHICKNESS, 0, CLIPBOUNDSTHICKNESS, this._bodyCanvas.height);
            }
        },

        // Checks if an edge is clipped
        _hasClippedEdges: function (edges, clippedEdge) {
            return ((edges & clippedEdge) != 0);
        }


    });


    EKjs.KinectDebug = KinectDebug;


})(EKjs || (EKjs = {}));

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




var EKjs;
(function (EKjs) {
    'use strict';

    var _this = null;

    var DragController = EKjs.Class.extend({


        constructor : function (body, target, velocity, sensibilityRatio) {

            velocity = (velocity) ? velocity : 0.2;
            sensibilityRatio = (sensibilityRatio) ? sensibilityRatio : 0.5;

            this._body = body;
            _this = this;

            this._dragHelper = new EKjs.DragHelper(velocity, sensibilityRatio);

            if (this._body && this._body.pointer) {

                this._body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.MOVE, this._getMousePosition, document.body);
                this._body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.UP, this._onUpHandler, document.body);
                this._body.pointer.addEventListener(EKjs.Kinect.Events.Pointer.DOWN, this._onDownHandler, target);
            }


        },

        /********************
         Public variables
         *********************/

        x: 0,
        y: 0,
        z: 0,

        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,


        /********************
         Public methods
         *********************/
        /**
         *
         * @public
         */
        update: function () {


            if (_this._dragHelper.needUpdate) {

                _this._dragHelper.updateDrag(_this._pointerX, _this._pointerY, _this._pointerZ);
                _this.x = _this._dragHelper.x;
                _this.y = _this._dragHelper.y;
                _this.z = _this._dragHelper.z;

                _this.rotateX = (-_this._dragHelper.y%360);
                _this.rotateY = (_this._dragHelper.x%360);
                _this.rotateZ = (_this._dragHelper.z%360);

            }

        },

        /**
         *
         * @param min
         * @param max
         */
        setLimitY: function (min, max) {
            this._dragHelper.minY = min;
            this._dragHelper.maxY = max;
        },


        /**
         *
         * @param min
         * @param max
         */
        setLimitX: function (min, max) {
            this._dragHelper.minX = min;
            this._dragHelper.maxX = max;
        },

        /**
         *
         * @param min
         * @param max
         */
        setLimitZ: function (min, max) {
            this._dragHelper.minZ = min;
            this._dragHelper.maxZ = max;
        },

        /**
         *
         * @param value
         */
        setInitX: function (value) {
            this._dragHelper.x = this._dragHelper._endX = value;
        },

        /**
         *
         * @param value
         */
        setInitY: function (value) {
            this._dragHelper.initY = this._dragHelper._endY = value;
        },

        /**
         *
         */
        isRefresh: function () {
            return this._dragHelper.needUpdate;
        },


        /********************
         Private variables
         *********************/
        _dragHelper: null,
        _pointerX: 0,
        _pointerY: 0,
        _pointerZ: 0,
        _body:null,


        /********************
         Private methods
         *********************/

        /**
         *
         * @param event
         * @private
         */
        _getMousePosition: function (event) {
            _this._pointerX = _this._body.pointer.x;
            _this._pointerY = _this._body.pointer.y;
            _this._pointerZ = _this._body.pointer.z;
        },

        /**
         *
         * @param event
         * @private
         */
        _onDownHandler: function (event) {

            _this._pointerX = _this._body.pointer.x;
            _this._pointerY = _this._body.pointer.y;
            _this._pointerZ = _this._body.pointer.z;
            _this._dragHelper.startDrag(_this._pointerX , _this._pointerY, _this._pointerZ);
        },


        /**
         *
         * @private
         */
        _onUpHandler: function () {
            _this._dragHelper.stopDrag();
        }
    });


    EKjs.DragController = DragController;


})(EKjs || (EKjs = {}));




var EKjs;
(function (EKjs) {
    'use strict';

    var _this = null;

    var DragHelper = EKjs.Class.extend({


        constructor: function (velocity, sensibilityRatio) {

            _this = this;

            _this.velocity = (velocity) ? velocity : 0.2;
            _this.sensibilityRatio = (sensibilityRatio) ? sensibilityRatio : 0.5;
        },


        /********************
         Public variables
         *********************/

        velocity: 0,
        sensibilityRatio: 0,

        isDrag: false,
        needUpdate: false,
        x: 0,
        y: 0,
        z: 0,
        minX: NaN,
        minY: NaN,
        minZ: NaN,

        maxY: NaN,
        maxX: NaN,
        maxZ: NaN,

        _dragX: 0,
        _dragY: 0,
        _dragZ: 0,

        _startX: 0,
        _endX: 0,

        _startY: 0,
        _endY: 0,

        _startZ: 0,
        _endZ: 0,

        _endVelocityCallback: null,
        _saveVelocityValue: 0,

        /********************
         Public methods
         *********************/
        /**
         *
         * @param  pointerX
         * @param  pointerY
         */
        startDrag: function (pointerX, pointerY, pointerZ) {
            _this.isDrag = true;
            _this.needUpdate = true;
            _this._startX = pointerX * _this.sensibilityRatio + _this._endX;
            _this._startY = pointerY * _this.sensibilityRatio + _this._endY;
            _this._startZ = pointerZ * _this.sensibilityRatio + _this._endZ;

        },

        /**
         *
         * @param endVelocityCallback
         */
        stopDrag: function (endVelocityCallback) {
            if (_this.isDrag) {
                _this.isDrag = false;
                _this._endX = _this._dragX;
                _this._endY = _this._dragY;
                _this._endZ = _this._dragZ;

                _this._endVelocityCallback = endVelocityCallback;
            }
        },

        /**
         *
         * @param  pointerX
         * @param  pointerY
         */
        updateDrag: function (pointerX, pointerY, pointerZ) {

            if (_this.isDrag) {
                _this._dragX = (_this._startX - pointerX * _this.sensibilityRatio);
                _this._dragY = (_this._startY - pointerY * _this.sensibilityRatio);
                _this._dragZ = (_this._startZ - pointerZ * _this.sensibilityRatio);


                // test minimum and maximum values Y
                if (!isNaN(_this.minY) && _this._dragY < _this.minY) _this._dragY = _this.minY;
                if (!isNaN(_this.maxY) && _this._dragY > _this.maxY) _this._dragY = _this.maxY;

                // test minimum and maximum values X
                if (!isNaN(_this.minX) && _this._dragX < _this.minX) _this._dragX = _this.minX;
                if (!isNaN(_this.maxX) && _this._dragX > _this.maxX) _this._dragX = _this.maxX;

                // test minimum and maximum values Y
                if (!isNaN(_this.minZ) && _this._dragZ < _this.minZ) _this._dragZ = _this.minZ;
                if (!isNaN(_this.maxZ) && _this._dragZ > _this.maxZ) _this._dragZ = _this.maxZ;
            }


            if ((Math.abs(_this.x - _this._dragX) < 1)
                && (Math.abs(_this.y - _this._dragY) < 1)
                && (Math.abs(_this.z - _this._dragZ) < 1)) {

                if (!_this.isDrag) {
                    if (_this._endVelocityCallback != null) _this._endVelocityCallback();
                    _this._endVelocityCallback = null;

                    _this.needUpdate = false;

                    _this._dragX = 0;
                    _this._dragY = 0;
                    _this._dragZ = 0;

                    _this._startX = 0;
                    _this._startY = 0;
                    _this._startZ = 0;
                }

            } else {

                _this.x += (_this._dragX - _this.x) * _this.velocity;
                _this.y += (_this._dragY - _this.y) * _this.velocity;
                _this.z += (_this._dragZ - _this.z) * _this.velocity;

            }

        },

        /********************
         Private variables
         *********************/
        _name: "",

        /********************
         Private methods
         *********************/
        _render: function () {
        }


    });


    EKjs.DragHelper = DragHelper;


})(EKjs || (EKjs = {}));

