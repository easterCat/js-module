(function(win, docuemnt) {
    var baseUrl;
    var paths;

    var setConfig = function(options) {
        if (!options) {
            options = {
                baseUrl: "/",
                paths: {}
            };
        }
        if (options.baseUrl) baseUrl = options.baseUrl;
        if (options.paths) paths = options.paths;
    };

    var depend = function(scriptName, callback) {
        if (!scriptName) return "script is indispensable";

        var script = docuemnt.getElementById(scriptName);

        if (script) return "script is exist";

        var scrpit_element = document.createElement("script");
        var body = document.getElementsByTagName("body")[0];
        scrpit_element.setAttribute("id", scriptName);
        scrpit_element.setAttribute("type", "text/javascript");
        scrpit_element.setAttribute("src", baseUrl + paths[scriptName]);

        if (body && scrpit_element) {
            body.appendChild(scrpit_element);
            scrpit_element.onload = function() {
                console.log("script is loaded =>", scriptName);
                callback && callback();
            };
        }
    };

    var depends = function(scriptNames, callback) {
        if (Object.prototype.toString.call(scriptNames) !== "[object Array]") {
            scriptNames = [];
        }
        scriptNames = scriptNames.reverse();
        var i = scriptNames.length - 1;
        while (i >= 0) {
            var current_script = document.getElementById(scriptNames[i]);
            if (current_script) return;

            var scrpit_element = document.createElement("script");
            var body = document.getElementsByTagName("body")[0];
            scrpit_element.setAttribute("id", scriptNames[i]);
            scrpit_element.setAttribute("type", "text/javascript");
            scrpit_element.setAttribute("src", baseUrl + paths[scriptNames[i]]);

            if (body && scrpit_element) {
                body.appendChild(scrpit_element);
                scrpit_element.onload = (function(index) {
                    console.log("script is loaded =>", scriptNames[index]);
                    console.log(body);
                    if (index === 0) callback && callback();
                })(i);
                i--;
            }
        }
    };

    win.ki = {
        setConfig,
        depend,
        depends
    };
})(window, document);

ki.setConfig({
    baseUrl: "./lib/",
    paths: {
        jquery: "jquery.js",
        underscore: "underscore.js"
    }
});

// ki.depend("jquery", function() {
//     // rgba(0,0,0);
//     var color = ["rgba(", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ")"];

//     $(".background").css({
//         position: "fixed",
//         top: "0px",
//         bottom: "0px",
//         left: "0px",
//         right: "0px",
//         background: color.join("")
//     });
// });

ki.depends(["jquery", "underscore"], function() {
    console.log($);
    $(".background").css({
        position: "fixed",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        background: color.join("")
    });

    _.each([1, 2, 3, 4], function(item) {
        console.log(item * 33);
    });
});
