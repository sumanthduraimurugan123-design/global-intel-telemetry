import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>L&T Techgium - Project Abstract Submission</title>
<style>
  @page {
    size: A4 portrait;
    margin: 18mm 18mm 18mm 18mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    margin: 0;
    padding: 0;
    line-height: 1.6;
    font-size: 11pt;
  }
  .header-badge {
    display: inline-block;
    background: linear-gradient(135deg, #0f172a, #1e3a8a);
    color: #ffffff;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 4px;
    margin-bottom: 12px;
  }
  .doc-title {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
    line-height: 1.25;
  }
  .doc-subtitle {
    font-size: 10.5pt;
    color: #2563eb;
    font-weight: 600;
    margin: 0 0 16px 0;
    letter-spacing: 0.5px;
  }
  .divider {
    height: 3px;
    background: linear-gradient(90deg, #2563eb, #38bdf8, #e2e8f0);
    border: none;
    margin-bottom: 20px;
  }
  .meta-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #2563eb;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 22px;
    display: table;
    width: 100%;
  }
  .meta-row {
    display: table-row;
  }
  .meta-label {
    display: table-cell;
    padding: 5px 12px 5px 0;
    font-weight: 700;
    color: #475569;
    font-size: 9.5pt;
    width: 25%;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .meta-value {
    display: table-cell;
    padding: 5px 0;
    font-weight: 600;
    color: #0f172a;
    font-size: 10.5pt;
  }
  .section-header {
    border-bottom: 2px solid #0f172a;
    padding-bottom: 6px;
    margin-top: 20px;
    margin-bottom: 14px;
    overflow: hidden;
  }
  .section-title {
    font-size: 12.5pt;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 1px;
    float: left;
    margin: 0;
  }
  .word-count-tag {
    font-size: 9pt;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 700;
    float: right;
  }
  .abstract-text {
    font-size: 11pt;
    line-height: 1.8;
    text-align: justify;
    color: #1e293b;
    margin: 0 0 24px 0;
    padding: 6px 0;
  }
  .highlight-grid {
    display: table;
    width: 100%;
    margin-top: 18px;
    border-top: 1px dashed #cbd5e1;
    padding-top: 16px;
  }
  .highlight-cell {
    display: table-cell;
    width: 33.33%;
    padding: 0 10px;
    vertical-align: top;
  }
  .highlight-cell:first-child { padding-left: 0; }
  .highlight-cell:last-child { padding-right: 0; }
  .highlight-title {
    font-size: 8.5pt;
    font-weight: 700;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  .highlight-desc {
    font-size: 8.5pt;
    color: #475569;
    line-height: 1.4;
  }
  .footer-note {
    margin-top: 28px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    font-size: 8.5pt;
    color: #64748b;
    overflow: hidden;
  }
  .footer-left { float: left; }
  .footer-right { float: right; }
</style>
</head>
<body>

  <div class="header-badge">L&amp;T Techgium &bull; Project Registration Abstract</div>
  <h1 class="doc-title">EconoPulse AI: Autonomous Multi-Modal Global Intelligence &amp; Geospatial Telemetry Platform</h1>
  <div class="doc-subtitle">Real-Time Threat Monitoring, Macroeconomic Telemetry &amp; 3D Geospatial Infrastructure Discovery</div>
  
  <div class="divider"></div>

  <div class="meta-box">
    <div class="meta-row">
      <div class="meta-label">Project Title:</div>
      <div class="meta-value">EconoPulse AI &mdash; Real-Time Global Intelligence &amp; Geospatial Telemetry Platform</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Participant:</div>
      <div class="meta-value">Sumanth Duraimurugan</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Register / Roll No:</div>
      <div class="meta-value">25cu0310160</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Institution:</div>
      <div class="meta-value">Hindustan Institute of Science and Technology (HITS)</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Team Structure:</div>
      <div class="meta-value">Individual Participant (Solo Entry)</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Technical Track:</div>
      <div class="meta-value">Smart Infrastructure, Geospatial Systems &amp; Applied AI</div>
    </div>
  </div>

  <div class="section-header">
    <h2 class="section-title">Project Abstract</h2>
    <span class="word-count-tag">Exact Count: 164 words</span>
  </div>

  <p class="abstract-text">
    Modern socio-economic disruptions, supply chain shocks, and regional crises unfold rapidly, yet individuals and organizational planners struggle with fragmented data streams and delayed analytical reporting. The aim of this project is to develop EconoPulse AI, an autonomous global intelligence and geospatial telemetry platform that democratizes real-time situational awareness. The proposed solution unites live macro-level event telemetry with an interactive 3D digital-twin globe, enabling users to monitor worldwide crises and seamlessly drill down to micro-level geographic infrastructure. Built using React, Three.js, Vite, and Node.js with Express, the architecture integrates OpenStreetMap, Overpass API, Nominatim spatial geocoding, and Google Gemini LLM reasoning engines. What makes this idea innovative is its dual-layer telemetry synthesis: pairing un-fabricated, ground-truth OpenStreetMap geospatial discovery with automated persona-based impact forecasting that translates global macroeconomic shocks into localized operational guidance. The expected outcome is a unified, high-performance web platform that empowers citizens, logistics operators, and researchers to visualize emerging threats, locate essential regional facilities instantly, and execute timely, data-driven decisions during critical global events.
  </p>

  <div class="highlight-grid">
    <div class="highlight-cell">
      <div class="highlight-title">Problem Statement</div>
      <div class="highlight-desc">Data fragmentation and delayed crisis reporting during global shocks leave individuals and planners without actionable regional intelligence.</div>
    </div>
    <div class="highlight-cell">
      <div class="highlight-title">Technical Innovation</div>
      <div class="highlight-desc">Dual-layer telemetry combining live macroeconomic shocks with ground-truth OpenStreetMap spatial discovery and zero synthetic hallucination.</div>
    </div>
    <div class="highlight-cell">
      <div class="highlight-title">Tools &amp; Frameworks</div>
      <div class="highlight-desc">React 19, Three.js 3D Globe, Node.js / Express, Overpass API, Nominatim Geocoding, Google Gemini LLMs, and Vercel Cloud.</div>
    </div>
  </div>

  <div class="footer-note">
    <span class="footer-left">Author: Sumanth Duraimurugan &bull; Roll: 25cu0310160 &bull; Hindustan Institute of Science and Technology</span>
    <span class="footer-right">Deployment: https://global-intel-telemetry.vercel.app</span>
  </div>

</body>
</html>
"""

with open("c:/Users/Sumanth/OneDrive/Desktop/Global-Intel-Telemetry/abstract.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML generated successfully.")
