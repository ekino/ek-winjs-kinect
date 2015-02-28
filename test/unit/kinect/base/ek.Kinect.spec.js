/* jshint undef:false*/
(function() {
    'use strict';

    describe('EKjs.Kinect init', function() {
        var kinect;

        beforeEach(function() {
            kinect  = EKjs.Kinect.getInstance();
        });

        it('Kinect should extends EKjs.Class', function() {
            expect(EKjs.Kinect.extend).toEqual(EKjs.Class.extend);
        });

        it('Kinect should be instanciated', function() {
            expect(kinect).not.toBeNull();
        });

        it('Kinect should create a KinectBodyFrame Class', function() {
            expect(kinect.bodyFrame).not.toBeNull();
        });

        it('Kinect should be a singleton', function() {
            expect(kinect).toEqual(EKjs.Kinect.getInstance());
        });

        it('Kinect.platform should be web and use an enum', function() {
            expect(kinect.platform).toEqual(EKjs.Kinect.PLATFORMS.WEB);
            expect(EKjs.Kinect.PLATFORMS.WEB).toEqual("web");
        });

        it('Kinect.platform should be web and use an enum', function() {
            window.WindowsPreview = {};

            expect(kinect.platform).toEqual(EKjs.Kinect.PLATFORMS.WIN8);
            expect(EKjs.Kinect.PLATFORMS.WEB).toEqual("win8");
        });

    });
})();