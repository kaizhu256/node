# benchmark fs.appendFile and fs.writeFile with option mkdirRecursive

#### running benchmark in windows
1. install git-for-windows

2. open git-bash shell

3. to benchmark patched nodejs, run
    `./node.mkdirRecursive.exe benchmark.js modeMkdirRecursive | tee -a .benchmark.mkdirRecursive.txt`

3. to benchmark vanilla nodejs, run
    `./node.commit-3f4ec9c3.exe benchmark.js | tee -a .benchmark.vanilla.txt`
