(function () {
    'use strict';


    var _this = null;
    var _needSimulation = null;

    /********************
        CONSTRUCTOR 
    *********************/
    var constructor = function () {

        _this = this;

    }


    /********************
        INSTANCE DEFINE 
    *********************/
    var instanceMembers = {
        /********************
            Public variables 
        *********************/


        /********************
            Public methods 
        *********************/
        setDebugs: function (debug) {
            this._debugs = debug;
        },

        trackBodyOn: function (x, dephX, z, dephZ) {

             _this._selectedBody = new EkWinjs.kinectBodyData();
             _this._selectedBody.trackArea.x = x;
             _this._selectedBody.trackArea.z = z;
             _this._selectedBody.trackArea.dephX = dephX;
             _this._selectedBody.trackArea.dephZ = dephZ;

             if(_needSimulation)
             {
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
        _bones : null,
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
            bones.push({ jointStart: jointType.head, jointEnd: jointType.neck });
            bones.push({ jointStart: jointType.neck, jointEnd: jointType.spineShoulder });
            bones.push({ jointStart: jointType.spineShoulder, jointEnd: jointType.spineMid });
            bones.push({ jointStart: jointType.spineMid, jointEnd: jointType.spineBase });
            bones.push({ jointStart: jointType.spineShoulder, jointEnd: jointType.shoulderRight });
            bones.push({ jointStart: jointType.spineShoulder, jointEnd: jointType.shoulderLeft });
            bones.push({ jointStart: jointType.spineBase, jointEnd: jointType.hipRight });
            bones.push({ jointStart: jointType.spineBase, jointEnd: jointType.hipLeft });

            // right arm
            bones.push({ jointStart: jointType.shoulderRight, jointEnd: jointType.elbowRight });
            bones.push({ jointStart: jointType.elbowRight, jointEnd: jointType.wristRight });
            bones.push({ jointStart: jointType.wristRight, jointEnd: jointType.handRight });
            bones.push({ jointStart: jointType.handRight, jointEnd: jointType.handTipRight });
            bones.push({ jointStart: jointType.wristRight, jointEnd: jointType.thumbRight });

            // left arm
            bones.push({ jointStart: jointType.shoulderLeft, jointEnd: jointType.elbowLeft });
            bones.push({ jointStart: jointType.elbowLeft, jointEnd: jointType.wristLeft });
            bones.push({ jointStart: jointType.wristLeft, jointEnd: jointType.handLeft });
            bones.push({ jointStart: jointType.handLeft, jointEnd: jointType.handTipLeft });
            bones.push({ jointStart: jointType.wristLeft, jointEnd: jointType.thumbLeft });

            // right leg
            bones.push({ jointStart: jointType.hipRight, jointEnd: jointType.kneeRight });
            bones.push({ jointStart: jointType.kneeRight, jointEnd: jointType.ankleRight });
            bones.push({ jointStart: jointType.ankleRight, jointEnd: jointType.footRight });

            // left leg
            bones.push({ jointStart: jointType.hipLeft, jointEnd: jointType.kneeLeft });
            bones.push({ jointStart: jointType.kneeLeft, jointEnd: jointType.ankleLeft });
            bones.push({ jointStart: jointType.ankleLeft, jointEnd: jointType.footLeft });

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

                    _this._selectedBody.rightHand.x = handRightPosition.x / _this._frameWidth;
                    _this._selectedBody.rightHand.y = handRightPosition.y / _this._frameHeight;
                    _this._selectedBody.rightHand.z = handRightPosition.z;

                    _this._selectedBody.handRightTracked = true;
                } else {
                    _this._selectedBody.handRightTracked = false;
                }

                //get hand position only on hand left up and push on front of head
                if (handLeftPosition.y < jointPoints[_this._JointType.spineBase].position.y
                 && (headPosition.z - handLeftPosition.z) > PUSH_Z_ACTIVE) {

                    _this._selectedBody.leftHandClosed = (body.handLeftState == WindowsPreview.Kinect.HandState.closed);
                    _this._selectedBody.leftHandOpen = (body.handLeftState == WindowsPreview.Kinect.HandState.open);

                    _this._selectedBody.leftHand.x = handLeftPosition.x / _this._frameWidth;
                    _this._selectedBody.leftHand.y = handLeftPosition.y / _this._frameHeight;
                    _this._selectedBody.leftHand.z = handLeftPosition.z;


                    _this._selectedBody.handLeftTracked = true;
                } else {
                    _this._selectedBody.handLeftTracked = false;
                }

                _this._selectedBody.head.x = headPosition.x / _this._frameWidth;
                _this._selectedBody.head.y = headPosition.y / _this._frameHeight;
                _this._selectedBody.head.z = headPosition.z;


                _this._selectedBody.spineBase.x = jointPoints[_this._JointType.spineBase].x / _this._frameWidth;
                _this._selectedBody.spineBase.y = jointPoints[_this._JointType.spineBase].y / _this._frameHeight;
                _this._selectedBody.spineBase.z = jointPoints[_this._JointType.spineBase].z;

                _this._selectedBody.isTracked = true;

                _this._selectedBody.render();
            }





        },

        _createJointPoints: function () {
            var jointPoints = new Array();

            for (var i = 0; i < this._jointCount; ++i) {
                jointPoints.push({ joint: 0, x: 0.5, y: 0.5, z: 0 });
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
        KinectBodyFrame: Class
    });

})();


