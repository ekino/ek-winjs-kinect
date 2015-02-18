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



