import os
import platform
import json
import time


def send_ipc_msg(msg: bytes):
    ATRI_IPC_PATH = os.environ["ATRI_IPC_PATH"]
    # 环境变量可以先不注入直接写死
    # ATRI_IPC_PATH = '/.pipe/put_your_pipename_here'
    if platform.system() == "Windows":
        import win32file
        import win32pipe
        handle = win32file.CreateFile(ATRI_IPC_PATH, win32file.GENERIC_READ | win32file.GENERIC_WRITE,
                              0, None, win32file.OPEN_EXISTING, win32file.FILE_ATTRIBUTE_NORMAL, None)
        win32file.WriteFile(handle, msg)
    else:
        import socket
        s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        s.connect(ATRI_IPC_PATH)
        s.send(msg)
        time.sleep(1000)
        s.close()


byte1 = b'www.baidu.com' # 字符串转换成byte类型


print('python 开始发送')
send_ipc_msg(byte1)
print('python 结束发送')
