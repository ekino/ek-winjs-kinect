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
