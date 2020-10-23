/* jslint utility2:true */
(function () {
    "use strict";
    function parse(filename) {
        let dict;
        dict = {};
        require("fs").readFileSync(filename, "utf8").replace((
            /^(.*?)\u0020-\u0020time\u0020elapsed\u0020-\u0020\u0020*?(\d\d*?)\u0020ms$/gm
        ), function (ignore, key, timeElapsed) {
            dict[key] = dict[key] || [];
            dict[key].push(Number(timeElapsed));
            return "";
        });
        console.log(dict);
        Object.keys(dict).forEach(function (key) {
            let diffSquared;
            let mean;
            let nn;
            let std;
            nn = dict[key].length;
            diffSquared = 0;
            mean = 0;
            dict[key].forEach(function (val) {
                mean += val;
            });
            mean = mean / nn;
            dict[key].forEach(function (val) {
                diffSquared += (val - mean) ** 2;
            });
            std = Math.sqrt(diffSquared / (nn - 1));
            mean = Math.round(mean);
            std = Math.round(std);
            console.log(key + "," + mean + " +/- " + std + " ms");
        });
    }
    parse(".benchmark.mkdirRecursive.txt");
    parse(".benchmark.vanilla.txt");
}());
