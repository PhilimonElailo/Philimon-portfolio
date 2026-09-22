import os
import PyPDF2

p = r"c:\Users\Renter\Desktop\Philimon's Portfolio\resume.pdf"
print('exists:', os.path.exists(p))
reader = PyPDF2.PdfReader(p)
print('pages:', len(reader.pages))
text = '\n'.join(page.extract_text() or '' for page in reader.pages)
print(text)
