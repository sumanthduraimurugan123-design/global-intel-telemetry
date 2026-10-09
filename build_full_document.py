import os
import sys

# Combine all chapters into report_document.html
from generate_html_content import get_html

workspace = r"c:\Users\Sumanth\OneDrive\Desktop\Global-Intel-Telemetry"
html_target = os.path.join(workspace, "report_document.html")

header = get_html()

# Read the rest of report_document.html from current report_document.html, replacing the title and adding deep content
# Let's read the existing report_document.html
with open(html_target, "r", encoding="utf-8") as f:
    old_content = f.read()

# Find where ACKNOWLEDGEMENT starts
ack_idx = old_content.find('<div class="page-break"></div>\n<h1 class="chapter-title">ACKNOWLEDGEMENT</h1>')
if ack_idx == -1:
    ack_idx = old_content.find('<h1 class="chapter-title">ACKNOWLEDGEMENT</h1>')

body_content = old_content[ack_idx:]

# Assemble new content with expanded sections
full_html = header + "\n" + body_content

with open(html_target, "w", encoding="utf-8") as f:
    f.write(full_html)

print("Saved preliminary assembled HTML. Now injecting deep engineering analysis...")
