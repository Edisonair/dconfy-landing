import sys
import math
from collections import deque
from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    queue = deque()
    
    # Start flood fill from the borders
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height-1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width-1, y))
        
    bg_color = pixels[0, 0]
    
    def color_dist(c1, c2):
        return math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2)
        
    def is_bg(c):
        return color_dist(c, bg_color) < 40
        
    visited = set()
    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        if x < 0 or x >= width or y < 0 or y >= height:
            continue
            
        visited.add((x, y))
        
        c = pixels[x, y]
        if is_bg(c):
            # Make transparent
            pixels[x, y] = (255, 255, 255, 0)
            queue.append((x+1, y))
            queue.append((x-1, y))
            queue.append((x, y+1))
            queue.append((x, y-1))
            
    img.save(output_path, "PNG")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
