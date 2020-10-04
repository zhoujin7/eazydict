# EazyDict简化版
[EazyDict](https://github.com/keenwon/eazydict)
仅保留查词功能, 输出HTML查词结果.
```cmd
node bin/cli
```
修改`src/lookup.js`中的`const lookupCli = require('./cli/lookup2')`, `lookup2`-->`lookup`, 输出命令行查词结果.
