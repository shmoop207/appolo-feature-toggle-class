var chai = require('chai'),
    Class = require('appolo-class'),
    _ = require('lodash'),
    should = require('chai').should(),
    featureToggleClass = require('../../lib/featureToggleClass'),
    featureToggleHandler = require('../../lib/featureToggleHandler');


describe("unit", function () {
    var featureToggleManager;

    beforeEach(function () {

        TEST = {};
        featureToggleClass._overrides = [];

        featureToggleManager = {
            isActive:function(){
                return true;
            }
        }


    });

    it("should override method",function(){

        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle'
            },
            constructor: function (width, height) {
                this.height = height;
                this.width = width;
            },

            area: function () {
                return this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            area:function(){
                return "working"
            }
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new Rectangle();

        rectangleOverride.area().should.be.eq('working')

    });

    it("should override constructor",function(){

        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle'
            },

            constructor: function (width, height) {
                this.height = height;
                this.width = width;
            },

            area: function () {
                return this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            constructor:function(){
                this.height = 20;
                this.width = 20;
            }
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle();

        rectangleOverride.area().should.be.eq(400)

    });

    it("should override no constructor",function(){

        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle'
            },


            area: function () {
                return 8;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{

        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle();

        rectangleOverride.area().should.be.eq(8)

    });


    it("should merge $config",function(){

        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle'
            },

            constructor: function (width, height) {
                this.height = height;
                this.width = width;
            },

            area: function () {
                return this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            $config:{
               statics:{
                   test:"working"
               }
            }
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle();

        rectangleOverride.test.should.be.eq('working');


    });

    it("should merge $config arrays",function(){

        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle',
                inject:['aa','bbb'],
                statics:{

                    test:"working"
                }
            },

            constructor: function (width, height) {
                this.height = height;
                this.width = width;
            },

            area: function () {
                return this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            $config:{
                inject:['ddd'],
                statics:{
                    test:"working2",
                    test2:"working3"
                }
            }
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle();

        rectangleOverride.test.should.be.eq('working2')
        rectangleOverride.test2.should.be.eq('working3')
        TEST.Rectangle.$config.inject.should.be.eql(['ddd' ]);

    });


    it("should merge $config union arrays",function(){

        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle',
                inject:['aa','bbb'],
                statics:{

                    test:"working"
                }
            },

            constructor: function (width, height) {
                this.height = height;
                this.width = width;
            },

            area: function () {
                return this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            $config:{
                inject:featureToggleClass.union(['ddd'])
            }
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle();

        TEST.Rectangle.$config.inject.should.be.eql(['aa','bbb','ddd' ]);

    });

    it("should override method with after",function(){


        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle'
            },

            constructor: function (width, height) {
                this.height = height;
                this.width = width;
            },

            area: function () {

               return this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            area:featureToggleClass.after(function(result){
                return result*2
            })
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle(2,2);

        rectangleOverride.area().should.be.eq(8);
    });


    it("should override method with before",function(){


        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle'
            },

            constructor: function (width, height) {
                this.height = height;
                this.width = width;
                this._area = 0;
            },

            area: function () {

                return this._area  * this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            area:featureToggleClass.before(function(){
                this._area = 4
            })
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle(2,2);

        rectangleOverride.area().should.be.eq(16)
    });


    it("should override method with wrap",function(){


        var Rectangle = Class.define({
            $config:{
                namespace:'TEST.Rectangle'
            },

            constructor: function (width, height) {
                this.height = height;
                this.width = width;
                this._area = 0;
            },

            area: function () {

                return  this.width * this.height;
            }
        });


        featureToggleClass.define(Rectangle,'aaa',{
            area:featureToggleClass.wrap(function(origin){
                var result = origin();

                return result *2;
            })
        });

        featureToggleHandler(featureToggleManager,Class);

        var rectangleOverride = new TEST.Rectangle(2,2);

        rectangleOverride.area().should.be.eq(8)
    });


});