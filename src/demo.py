from PIL import Image
import os
import sys
import imagehash

fpath = "../pic/20230601-140634.jpeg"


content = imagehash.average_hash(Image.open(fpath))


print(content)
