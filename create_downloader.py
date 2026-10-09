import os
import base64

pdf_path = r"c:\Users\Sumanth\OneDrive\Desktop\Global-Intel-Telemetry\Translating_Global_Events_Into_Personal_Impact_Insights.pdf"

with open(pdf_path, "rb") as f:
    pdf_b64 = base64.b64encode(f.read()).decode("utf-8")

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Download Project Report PDF</title>
<style>
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #0f172a;
    color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
  }}
  .card {{
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 36px 44px;
    max-width: 520px;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  }}
  h1 {{
    font-size: 20px;
    margin-bottom: 12px;
    color: #60a5fa;
  }}
  p {{
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 24px;
  }}
  .btn {{
    display: inline-block;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    font-weight: 600;
    font-size: 15px;
    padding: 12px 28px;
    border-radius: 8px;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    transition: all 0.2s;
  }}
  .btn:hover {{
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    transform: translateY(-1px);
  }}
  .subtext {{
    margin-top: 18px;
    font-size: 12px;
    color: #64748b;
  }}
</style>
</head>
<body>
<div class="card">
  <div style="font-size: 48px; margin-bottom: 14px;">📄</div>
  <h1>Translating Global Events into Personal Impact Insights</h1>
  <p>Your 39-page sanitized design project report is ready. The download should begin automatically.</p>
  <a id="downloadBtn" class="btn" href="#">⬇️ Download PDF Now</a>
  <div class="subtext">Filename: Translating_Global_Events_Into_Personal_Impact_Insights.pdf (776 KB)</div>
</div>

<script>
  const b64Data = "{pdf_b64}";
  const byteCharacters = atob(b64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {{
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }}
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {{type: 'application/pdf'}});
  const url = URL.createObjectURL(blob);

  const btn = document.getElementById('downloadBtn');
  btn.href = url;
  btn.download = "Translating_Global_Events_Into_Personal_Impact_Insights.pdf";

  // Auto trigger download
  window.onload = function() {{
    const a = document.createElement('a');
    a.href = url;
    a.download = "Translating_Global_Events_Into_Personal_Impact_Insights.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }};
</script>
</body>
</html>
"""

dest_html = r"c:\Users\Sumanth\OneDrive\Desktop\Global-Intel-Telemetry\download_report.html"
with open(dest_html, "w", encoding="utf-8") as f:
    f.write(html)
print("Created download_report.html successfully!")
