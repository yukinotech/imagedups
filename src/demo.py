from PIL import Image
import os
import sys
import imagehash



fpath = "../pic/demo.jpg"
content = imagehash.average_hash(Image.open(fpath))
print(content)
 


