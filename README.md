# benchmark fs.appendFile and fs.writeFile with option mkdirRecursive

#### run windows benchmark
1. install git-for-windows

2. open git-bash shell

3. to benchmark patched nodejs, run
    `./node.mkdirRecursive.exe benchmark.js modeMkdirRecursive | tee -a .benchmark.mkdirRecursive.txt`

3. to benchmark vanilla nodejs, run
    `./node.commit-3f4ec9c3.exe benchmark.js | tee -a .benchmark.vanilla.txt`


#### windows benchmark result
```
async-operation                                         master-branch           pr-branch       performance-impact
30 * 1000 * (fs.writeFile      w/ no-mkdir      )      934 +/-  50 ms      929 +/-  82 ms    no performance-impact
30 * 1000 * (fs.writeFile      w/ fs.mkdir      )      722 +/- 163 ms      722 +/- 159 ms    no performance-impact
30 * 1000 * (fs.writeFile      w/ mkdirRecursive)             ---- ms     1244 +/- 135 ms    72% slower (lazy-mkdirRecursive vs eager-fs.mkdir)

async-operation                                         master-branch           pr-branch       performance-impact
30 * 1000 * (fs.appendFile     w/ no-mkdir      )      983 +/-  62 ms      966 +/-  92 ms    no performance-impact
30 * 1000 * (fs.appendFile     w/ fs.mkdir      )      739 +/- 175 ms      730 +/- 184 ms    no performance-impact
30 * 1000 * (fs.appendFile     w/ mkdirRecursive)             ---- ms     1252 +/- 126 ms    69% slower (lazy-mkdirRecursive vs eager-fs.mkdir)


 sync-operation                                         master-branch           pr-branch       performance-impact
30 * 1000 * (fs.writeFileSync  w/ no-mkdir      )     1008 +/-  42 ms     1007 +/-  45 ms    no performance-impact
30 * 1000 * (fs.writeFileSync  w/ fs.mkdirSync  )     1643 +/- 121 ms     1611 +/- 117 ms    no performance-impact
30 * 1000 * (fs.writeFileSync  w/ mkdirRecursive)             ---- ms     1791 +/-  87 ms     9% slower (lazy-mkdirRecursive vs eager-fs.mkdir)

 sync-operation                                         master-branch           pr-branch       performance-impact
30 * 1000 * (fs.appendFileSync w/ no-mkdir      )      999 +/-  47 ms     1019 +/-  53 ms    no performance-impact
30 * 1000 * (fs.appendFileSync w/ fs.mkdirSync  )     1617 +/- 103 ms     1619 +/- 109 ms    no performance-impact
30 * 1000 * (fs.appendFileSync w/ mkdirRecursive)             ---- ms     1789 +/- 104 ms    11% slower (lazy-mkdirRecursive vs eager-fs.mkdir)
```
