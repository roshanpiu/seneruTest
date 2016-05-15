// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'angular-json-tree'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller('DBTreeViewController', function($scope, $http) {
    $scope.name = "DB Tree"

    $scope.databaseTree = {};

    $scope.showDBTree = false;

    $http.get('senerutest.herokuapp.com/getDbStructure').then(function(data) {

        if (data.data) {
            $scope.showDBTree = true;
        }

        console.log(data.data);
        $scope.databaseTree = data.data;
    });
})

.controller('XsdDiagramController', function($scope, $http) {
    $scope.name = "XSD Diagram";



    $http.get('raw.githubusercontent.com/roshanpiu/seneruTest/master/xmlSchema.xsd').then(function(data) {
        var xmlString = data.data;

        var req = {
            method: 'POST',
            url: 'senerutest.herokuapp.com/getSvg',
            headers: {
                'Content-Type': 'application/xml'
            },
            data: xmlString
        };

        $http(req).then(function(res) {
            console.log(res);
        }, function() {});

    });

})

.controller('XsdTreeViewController', function($http, $scope, XmlToJson) {
    $scope.name = "XSD Tree"

    var Tree = [];
    $scope.xsdTree = {};

    $scope.showXsdTree = false;

    $http.get('raw.githubusercontent.com/roshanpiu/seneruTest/master/xmlSchema.xsd').then(function(data) {

        if (data.data) {
            $scope.showXsdTree = true;
        }

        var parsedXml = XmlToJson.parseXml(data.data);
        $scope.xsdTree = XmlToJson.xmlToJson(parsedXml);

        //createTree(Tree,1); 


    });

    function createTreeArray(json) {
        var parent = 0;
        var counter = 0;
        var text = "";
        var newTree = new Array;

        function walk(obj, parent) {

            for (var key in obj) {

                counter++;
                if (typeof(obj[key]) == "string" || typeof(obj[key]) == "number" || typeof(obj[key]) == "boolean") {
                    text = counter + "|" + parent + "|" + key + " : " + obj[key] + "|#";
                    newTree.push(text);
                } else {

                    text = counter + "|" + parent + "|" + key + "|#";
                    newTree.push(text);
                    walk(obj[key], counter)
                }
            }
        }
        walk(json, parent);
        console.log(newTree);
        return newTree;
    }
})