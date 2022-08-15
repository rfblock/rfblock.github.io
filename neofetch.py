# Hacked together script that generates ascii art with (many) span tags

import re

filter = r'\[38;2;([0-9]+?);([0-9]+?);([0-9]+?)m(.)\[0m'
img_width = 36
img_height = 18

out = ""

with open('neostegg-final.txt') as f:
	lastRGB = None
	rgb, char = [], []

	data = ''.join(f.readlines()) # Get the entire file as as tring
	
	matches = re.findall(filter, data) # Separate the files into RGB values and related characters

	for match in matches:
		rgb.append(f'rgb({match[0]},{match[1]},{match[2]})') # Separate the files into RGB values and related characters
		char += match[3]

	print(data)
	print(len(char))

	for y in range(img_height):
		for x in range(img_width):
			i = x+y*img_width

			if lastRGB != rgb[i] and char[i] != ' ': # Only create a new span tag whenever the color changes and a visible character is shown
				if lastRGB != None:
					out += '</span>'
				out += f'<span style="color:{rgb[i]}">'
				lastRGB = rgb[i]

			print(char[i], end='')
			out += char[i]

		print()
		lastRGB = None	# Force a new tag to start after each line
		out += '</span>\n'

with open('neofetch.html', 'w') as f: # Write the output
	f.write(out)