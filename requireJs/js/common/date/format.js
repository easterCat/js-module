define([], function () {
    var format = function (d) {
        return d.toLocaleDateString()
    };
    return {
        format: format
    }
});