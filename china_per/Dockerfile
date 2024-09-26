# 使用官方的 Python 3.9 镜像作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 将当前目录下的所有文件复制到容器中的 /app 目录
COPY . /app

# 设置 pip 使用清华源
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 安装所需的 Python 依赖包
RUN pip install --no-cache-dir -r requirements.txt

# 运行 Python 脚本
CMD ["python", "get_per.py"]