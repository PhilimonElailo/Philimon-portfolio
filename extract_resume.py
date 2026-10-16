import os
import PyPDF2

p = os.path.join(os.path.dirname(__file__), "Resume (Philimon  Elailo).pdf")
print('exists:', os.path.exists(p))
reader = PyPDF2.PdfReader(p)
print('pages:', len(reader.pages))
text = '\n'.join(page.extract_text() or '' for page in reader.pages)
print(text)
