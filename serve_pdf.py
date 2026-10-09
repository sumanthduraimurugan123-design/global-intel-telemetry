import http.server
import socketserver
import os

PORT = 8899
WORKSPACE = r"c:\Users\Sumanth\OneDrive\Desktop\Global-Intel-Telemetry"
REPORT_PDF = os.path.join(WORKSPACE, "Translating_Global_Events_Into_Personal_Impact_Insights.pdf")
PAPER_PDF = os.path.join(WORKSPACE, "Research_Paper_Translating_Global_Events_Into_Personal_Impact_Insights.pdf")

HTML_PORTAL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Project Documentation & Research Paper Downloads</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #0b1329;
    color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
  }
  .container {
    max-width: 840px;
    width: 100%;
    text-align: center;
  }
  h1 {
    font-size: 24px;
    color: #60a5fa;
    margin-bottom: 6px;
  }
  p.subtitle {
    color: #94a3b8;
    font-size: 14px;
    margin-bottom: 30px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    text-align: left;
  }
  .card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card:hover {
    border-color: #3b82f6;
  }
  .badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .badge-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
  .badge-purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
  .card h2 {
    font-size: 17px;
    margin: 0 0 10px 0;
    color: #f1f5f9;
    line-height: 1.35;
  }
  .card p {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
    margin: 0 0 18px 0;
  }
  .btn {
    display: block;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 18px;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s;
  }
  .btn-blue {
    background: #2563eb;
    color: white;
  }
  .btn-blue:hover { background: #1d4ed8; }
  .btn-purple {
    background: #7c3aed;
    color: white;
  }
  .btn-purple:hover { background: #6d28d9; }
  .meta {
    margin-top: 10px;
    font-size: 11.5px;
    color: #64748b;
    text-align: center;
  }
</style>
</head>
<body>
<div class="container">
  <h1>Translating Global Events into Personal Impact Insights</h1>
  <p class="subtitle">Official Academic Documentation & Scientific Research Publications</p>

  <div class="grid">
    <div class="card">
      <div>
        <span class="badge badge-purple">IEEE Academic Format</span>
        <h2>Scientific Research Paper</h2>
        <p>Full 6-page double-column IEEE Transactions formatted research paper. Features literature review (GDELT, POLECAT, MultiMUC), mathematical shock propagation formulation, WebGL GLSL shaders, 2G cellular IVR metrics, STRIDE security analysis, and 20 authoritative references (2023&ndash;2026).</p>
      </div>
      <div>
        <a class="btn btn-purple" href="/download-paper">⬇️ Download Research Paper PDF</a>
        <div class="meta">6 Pages &bull; 321 KB &bull; IEEE 2-Column</div>
      </div>
    </div>

    <div class="card">
      <div>
        <span class="badge badge-blue">University Thesis Format</span>
        <h2>Comprehensive Design Project Report</h2>
        <p>Complete 40-page university-standard design project final report. Starting from Page 3 (TOC, Acknowledgement, Abstract, Chapters 1&ndash;10, and Appendix). Includes deep econometric modeling, full SQL DDL with RLS, latency percentiles, and real-world case studies.</p>
      </div>
      <div>
        <a class="btn btn-blue" href="/download-report">⬇️ Download Project Report PDF</a>
        <div class="meta">40 Pages &bull; 916 KB &bull; Standard A4</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>
"""

class UnifiedDownloadHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_PORTAL.encode("utf-8"))
            return

        elif self.path in ["/download-paper", "/paper", "/Research_Paper_Translating_Global_Events_Into_Personal_Impact_Insights.pdf"]:
            if os.path.exists(PAPER_PDF):
                self.send_response(200)
                self.send_header("Content-Type", "application/pdf")
                self.send_header("Content-Disposition", 'attachment; filename="Research_Paper_Translating_Global_Events_Into_Personal_Impact_Insights.pdf"')
                self.send_header("Content-Length", str(os.path.getsize(PAPER_PDF)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(PAPER_PDF, "rb") as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, "Research Paper PDF Not Found")
                return

        elif self.path in ["/download", "/download-report", "/report", "/Translating_Global_Events_Into_Personal_Impact_Insights.pdf"]:
            if os.path.exists(REPORT_PDF):
                self.send_response(200)
                self.send_header("Content-Type", "application/pdf")
                self.send_header("Content-Disposition", 'attachment; filename="Translating_Global_Events_Into_Personal_Impact_Insights.pdf"')
                self.send_header("Content-Length", str(os.path.getsize(REPORT_PDF)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                with open(REPORT_PDF, "rb") as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, "Report PDF Not Found")
                return

        else:
            super().do_GET()

if __name__ == "__main__":
    os.chdir(WORKSPACE)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), UnifiedDownloadHandler) as httpd:
        print(f"Serving Unified Download Portal at http://localhost:{PORT}")
        httpd.serve_forever()
