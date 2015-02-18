var EKjs;
(function (EKjs) {
    'use strict';

    var _this = null;

    var DragController = EKjs.Class.extend({


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


    EKjs.DragController = DragController;


})(EKjs || (EKjs = {}));

