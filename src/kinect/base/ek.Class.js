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
