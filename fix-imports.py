#!/usr/bin/env python3
import os
import re

# 定义UI组件目录
ui_dir = '/Users/jingren/Downloads/project/src/components/ui'

# 遍历所有tsx文件
for filename in os.listdir(ui_dir):
    if filename.endswith('.tsx'):
        filepath = os.path.join(ui_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # 移除@版本号
        content = re.sub(r'@(\d+\.\d+\.\d+)', '', content)

        with open(filepath, 'w') as f:
            f.write(content)

        print(f'Fixed: {filename}')

print('All imports fixed!')

