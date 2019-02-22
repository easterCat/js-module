ki.setConfig({
    baseUrl: "lib/",
    paths: {
        jquery: "jquery.js",
        underscore: "underscore.js"
    }
});

ki.depends(["jquery", "underscore"], function() {
    // rgba(0,0,0);
    var color = ["rgba(", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ")"];

    $(".background").css({
        position: "fixed",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        background: color.join("")
    });

    window._.each([1, 2, 3, 4, 5], function(item) {
        console.log(item * 33);
    });
});
