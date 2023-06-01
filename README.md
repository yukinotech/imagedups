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
