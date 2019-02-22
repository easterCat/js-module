require.config({
    baseUrl: 'js',
    paths: {
        "jquery": "../lib/jquery",
        "underscore": "../lib/underscore",
        "date": "./common/date",
    }
})

require(['jquery', 'underscore', 'color', 'date/date', 'date/format'], function ($, _, c, d, f) {
    $(window).resize(function () {
        $(".background").css({
            position: "fixed",
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            background: c.color.join("")
        });
    });

    console.log(d.date);
    console.log(f.format(d.date))
});