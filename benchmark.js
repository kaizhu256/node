/* jslint utility2:true */
(function () {
    "use strict";
    let fs;
    let modeMkdirRecursive;
    let nn;
    let path;
    fs = require("fs");
    path = require("path");
    // init modeMkdirRecursive
    modeMkdirRecursive = process.argv[2] === "modeMkdirRecursive";
    // init nn
    nn = 1000;
    function cleanup() {
    /*
     * this function will cleanup .test dir
     */
        console.log("\ncleanup .test/");
        require("child_process").spawnSync("rm", [
            "-rf", ".test"
        ], {
            stdio: [
                "ignore", 1, 2
            ]
        });
        fs.mkdirSync(".test");
    }
    function onErrorThrow(err) {
    /*
     * this function will throw <err> if exists
     */
        if (err) {
            throw err;
        }
    }
    async function testFsOperation(operation, modeMkdir) {
    /*
     * this function will async-test <operation> with mkdir performance
     */
        let timeStart;
        async function fsOperation(filename) {
            if (modeMkdir === "fs.mkdir") {
                await new Promise(function (resolve) {
                    fs.mkdir(path.dirname(filename), {
                        recursive: true
                    }, function (err) {
                        onErrorThrow(err);
                        resolve();
                    });
                });
            }
            await new Promise(function (resolve) {
                function onError(err) {
                    onErrorThrow(err);
                    resolve();
                }
                switch (operation) {
                case "fs.appendFile":
                    fs.appendFile(filename, "hello", {
                        mkdirRecursive: modeMkdir === "mkdirRecursive"
                    }, onError);
                    break;
                case "fs.writeFile":
                    fs.writeFile(filename, "hello", {
                        mkdirRecursive: modeMkdir === "mkdirRecursive"
                    }, onError);
                    break;
                default:
                    throw new Error("invalid operation " + operation);
                }
            });
            // debug
            // console.log(operation + " " + filename);
        }
        cleanup();
        timeStart = Date.now();
        await Promise.all(Array.from(
            new Uint8Array(nn)
        ).map(function (ignore, ii) {
            let filename;
            filename = (
                modeMkdir
                ? ".test/" + ii + "/aa/bb/foo.txt"
                : ".test/" + ii + ".foo.txt"
            );
            return fsOperation(filename);
        }));
        console.log(
            nn + " * (" + operation.padEnd(17, " ") + " + "
            + String(modeMkdir || "no-mkdir").padEnd(14, " ")
            + ") - time elapsed - "
            + String(Date.now() - timeStart).padStart(4, " ") + " ms"
        );
    }
    function testFsOperationSync(operation, modeMkdir) {
    /*
     * this function will sync-test <operation> with mkdir performance
     */
        let ii;
        let timeStart;
        function fsOperation(filename) {
            if (modeMkdir === "fs.mkdirSync") {
                fs.mkdirSync(path.dirname(filename), {recursive: true});
            }
            switch (operation) {
            case "fs.appendFileSync":
                fs.appendFileSync(filename, "hello", {
                    mkdirRecursive: modeMkdir === "mkdirRecursive"
                });
                break;
            case "fs.writeFileSync":
                fs.writeFileSync(filename, "hello", {
                    mkdirRecursive: modeMkdir === "mkdirRecursive"
                });
                break;
            default:
                throw new Error("invalid operation " + operation);
            }
        }
        cleanup();
        timeStart = Date.now();
        ii = 0;
        while (ii < nn) {
            let filename;
            filename = (
                modeMkdir
                ? ".test/" + ii + "/aa/bb/foo.txt"
                : ".test/" + ii + ".foo.txt"
            );
            fsOperation(filename);
            ii += 1;
        }
        console.log(
            nn + " * (" + operation.padEnd(17, " ") + " + "
            + String(modeMkdir || "no-mkdir").padEnd(14, " ")
            + ") - time elapsed - "
            + String(Date.now() - timeStart).padStart(4, " ") + " ms"
        );
    }
    (async function test() {
        console.log(process.versions);
        await testFsOperation("fs.writeFile", undefined);
        await testFsOperation("fs.writeFile", "fs.mkdir");
        if (modeMkdirRecursive) {
            await testFsOperation("fs.writeFile", "mkdirRecursive");
        }
        await testFsOperation("fs.appendFile", undefined);
        await testFsOperation("fs.appendFile", "fs.mkdir");
        if (modeMkdirRecursive) {
            await testFsOperation("fs.appendFile", "mkdirRecursive");
        }
        [
            "fs.writeFileSync", "fs.appendFileSync"
        ].forEach(function (operation) {
            testFsOperationSync(operation, undefined);
            testFsOperationSync(operation, "fs.mkdirSync");
            if (modeMkdirRecursive) {
                testFsOperationSync(operation, "mkdirRecursive");
            }
        });
    }());
}());
