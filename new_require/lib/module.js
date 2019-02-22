(function(win) {
    var baseUrl;
    var paths;
    var script_cache = {};
    var script_queue = [];

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

    // 用来创建script标签并且添加到body上
    var _createScript = function(script_name) {
        var scrpit_element = document.createElement("script");
        var fs = document.getElementsByTagName("script")[0];

        scrpit_element.setAttribute("id", script_name);
        scrpit_element.setAttribute("type", "text/javascript");
        scrpit_element.setAttribute("src", baseUrl + paths[script_name]);

        fs.parentNode.insertBefore(scrpit_element, fs);

        return scrpit_element;
    };

    var _saveScript = function(script) {
        script.status = "loaded";
        script_cache[script.name] = script;
    };

    var _queue = function() {
        var save_script = script_queue[0];

        if (script_queue[0]) {
            var script = document.getElementById(script_queue[0].name);

            if (script) {
                if (script_queue.length > 0) {
                    script_queue.splice(0, 1);
                    _queue();
                } else {
                    return script_queue[0].callback();
                }
            } else {
                var script = _createScript(script_queue[0].name);

                script.onload = script.onreadystatechange = function() {
                    _saveScript(script_queue[0]);
                    script_queue.splice(0, 1);
                    if (script_queue.length <= 0) {
                        save_script.callback();
                    } else {
                        _queue();
                    }
                };
            }
        } else {
            return;
        }
    };

    var depends = function(script_names, callback) {
        if (Object.prototype.toString.call(script_names) !== "[object Array]") {
            if (script_names) {
                script_names = [script_names];
            } else {
                script_names = [];
            }
        }

        script_names.forEach(function(item) {
            script_queue.push({
                name: item,
                status: "start",
                callback: callback
            });
        });

        _queue();
    };

    var getCache = function() {
        return script_cache;
    };

    win.ki = {
        getCache,
        setConfig,
        depends
    };
})(window);
