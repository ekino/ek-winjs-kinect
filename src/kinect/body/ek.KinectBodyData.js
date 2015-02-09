(function () {
    'use strict';

    /********************
        CONSTRUCTOR 
    *********************/ 
    var constructor = function () {
	   this.pointer = new EkWinjs.KinectPointer(this);
	}
	
    /********************
        INSTANCE DEFINE 
    *********************/ 
    var instanceMembers = {

        /********************
            Public variables 
        *********************/

        id: 0,
        //EkWinjs.KinectPointer
        pointer: null,

        pointMultiplier:1,

        trackArea: {
            x: 0.5,
            z: 1,
            dephX: 0.2,
            dephZ: 0.1,
            handPushZ: 0.25
        },

        rightHand: { x: 0, y: 0, z: 0 },

        leftHand: { x: 0, y: 0, z: 0 },

        head: { x: 0, y: 0, z: 0 },

        spineBase: { x: 0, y: 0, z: 0 },

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
        },


        /********************
            Private variables 
        *********************/
        _name: "",

        /********************
            Private methods 
        *********************/
        _funct: function () {
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
        kinectBodyData: Class
    });

})();


