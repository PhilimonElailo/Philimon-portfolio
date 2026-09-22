from PIL import Image, ImageDraw, ImageFont
import os

img = Image.new('RGBA', (64, 64), (12, 19, 32, 255))
draw = ImageDraw.Draw(img)
draw.ellipse((2, 2, 62, 62), fill=(16, 185, 129, 255))
font_path = 'C:/Windows/Fonts/arial.ttf'
font = ImageFont.truetype(font_path, 24) if os.path.exists(font_path) else ImageFont.load_default()
bbox = draw.textbbox((0, 0), 'PE', font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
x = (64 - tw) / 2
y = (64 - th) / 2
draw.text((x, y), 'PE', fill=(255, 255, 255, 255), font=font)
img.save('favicon.png')
img.save('favicon.ico', format='ICO')
print('favicon.png', os.path.getsize('favicon.png'))
print('favicon.ico', os.path.getsize('favicon.ico'))
