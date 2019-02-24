define("init", function(require, exports, module) {
  var color = require("../src/color");
  var initText = require("../src/text");
  var $ = require("jquery");

  module.exports = {
    start: function() {
      console.log(initText.text + "," + initText.text2);
      $(function() {
        $("#change").click(function() {
          color.changeBg();
        });
      });
    }
  };
});
