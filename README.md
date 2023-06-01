## 建议使用虚拟环境安装依赖

操作步骤：

1. 安装 virtualenv

```
pip install virtualenv
```

2. 在项目根目录下执行 virtualenv，指定 python 版本

```
virtualenv -p python3.10 venv-env
```

其中 venv-env 就是目录名称，可以自定义

3. 激活虚拟环境

linux/macOS

```
source ./venv-env/bin/activate
```

source 和 bash 都是 linux 执行 sh 的命令

windows

```
./venv-env/bin/activate.ps1
```

终端激活虚拟环境后，执行的 pip 命令安装的包都会在项目目录中，保证项目隔离

## 项目预期覆盖的需求点

基础能力：

1. 综合多个指标，比较 2 个图片的相似度

应用能力：

1. 同一目录下的图片去重
2. 递归同一目录下的所有子目录图片去重
3. 比较两个目录（非递归）里图片重复的个数

## 技术实现

js 调用 python 库实现图片 diff，涉及 2 个进程，需要进行 IPC 通信
IPC 通信方案：
linux 使用 Unix domain socket，windows 使用 named socket。方案灵感来源：
https://shyamswaroop.hashnode.dev/ipc-between-nodejs-python
https://github.com/Atri-Labs/atrilabs-engine/blob/250b2c9029b7d44a0991b8dcdd83d49ff304459e/packages/node-python-ipc/src/index.ts#L7

简单介绍 node socket IPC 的文章： https://tsejx.github.io/node-guidebook/system/process/ipc/#%E5%85%B6%E4%BB%96%E6%96%B9%E5%BC%8F%E5%AE%9E%E7%8E%B0%E8%BF%9B%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1
