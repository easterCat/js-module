define("color", function(require, exports, module) {
  var $ = require("jquery");

  var createColor = function() {
    return ["rgba(", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ")"];
  };

  module.exports = {
    changeBg: function() {
      $("#bg").css({
        position: "fixed",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        background: createColor().join("")
      });
    }
  };
});
