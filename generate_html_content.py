# Helper to generate the complete HTML document
import os

def get_html():
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Translating Global Events into Personal Impact Insights - Comprehensive Design Project Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 20mm 18mm 20mm 18mm;
    @top-right {
      content: "Translating Global Events into Personal Impact Insights";
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 8pt;
      color: #64748b;
    }
    @bottom-center {
      content: counter(page);
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 9pt;
      color: #334155;
      font-weight: 600;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #1e293b;
    margin: 0;
    padding: 0;
    text-align: justify;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Arial', 'Segoe UI', sans-serif;
    color: #0f172a;
    font-weight: 700;
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    page-break-after: avoid;
  }

  .chapter-title {
    font-size: 16.5pt;
    text-align: center;
    text-transform: uppercase;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 5px;
    margin-top: 0;
    margin-bottom: 16px;
    color: #0b192c;
  }

  .chapter-number {
    font-size: 12.5pt;
    text-align: center;
    font-weight: bold;
    color: #1e40af;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  h2 {
    font-size: 13pt;
    border-left: 4px solid #1e40af;
    padding-left: 8px;
    margin-top: 16px;
    color: #1e3a8a;
  }

  h3 {
    font-size: 11.5pt;
    color: #1e293b;
    margin-top: 12px;
  }

  h4 {
    font-size: 10.5pt;
    color: #334155;
    margin-top: 10px;
    font-style: italic;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
    text-indent: 1.5em;
  }

  .no-indent {
    text-indent: 0;
  }

  .page-break {
    page-break-before: always;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-family: 'Arial', sans-serif;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 9px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: bold;
    border-bottom: 2px solid #94a3b8;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  .table-title {
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    font-size: 9.5pt;
    color: #334155;
    margin-bottom: 5px;
    text-align: center;
  }

  /* Code & Equation styling */
  .code-block {
    background: #0f172a;
    color: #f8fafc;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    padding: 10px 14px;
    border-radius: 6px;
    margin: 10px 0;
    overflow-x: auto;
    line-height: 1.4;
    page-break-inside: avoid;
  }

  .equation-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 8px 12px;
    margin: 10px 0;
    text-align: center;
    font-family: 'Cambria Math', 'Times New Roman', serif;
    font-size: 11pt;
    color: #0f172a;
    page-break-inside: avoid;
  }

  /* Lists */
  ul, ol {
    margin-top: 4px;
    margin-bottom: 10px;
    padding-left: 26px;
  }

  li {
    margin-bottom: 4px;
  }

  /* Callouts */
  .callout {
    background: #f0fdf4;
    border-left: 4px solid #16a34a;
    padding: 8px 12px;
    margin: 12px 0;
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
    border-radius: 0 4px 4px 0;
  }

  .callout-blue {
    background: #eff6ff;
    border-left: 4px solid #2563eb;
    padding: 8px 12px;
    margin: 12px 0;
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
    border-radius: 0 4px 4px 0;
  }

  .callout-purple {
    background: #faf5ff;
    border-left: 4px solid #9333ea;
    padding: 8px 12px;
    margin: 12px 0;
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
    border-radius: 0 4px 4px 0;
  }

  /* Diagram container */
  .diagram-container {
    text-align: center;
    margin: 16px 0;
    page-break-inside: avoid;
  }

  .caption {
    font-family: 'Arial', sans-serif;
    font-size: 9pt;
    color: #475569;
    margin-top: 5px;
    font-style: italic;
    text-align: center;
  }

  /* TOC layout */
  .toc-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
    border-bottom: 1px dotted #cbd5e1;
    padding-bottom: 2px;
  }

  .toc-chapter {
    font-weight: bold;
    color: #0f172a;
    margin-top: 7px;
  }

  .toc-sub {
    padding-left: 18px;
    color: #334155;
  }

  .toc-sub2 {
    padding-left: 36px;
    color: #64748b;
    font-size: 9.5pt;
  }

  .toc-page {
    font-weight: bold;
    color: #1e40af;
  }

  .meta-header {
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
  }

  .meta-header h2 {
    font-size: 14pt;
    margin: 0;
    border: none;
    padding: 0;
    color: #0f172a;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .meta-header p {
    margin: 5px 0 0 0;
    text-indent: 0;
    font-size: 11.5pt;
    font-weight: bold;
    color: #1e40af;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>

<!-- ========================================== -->
<!-- PAGE 3: TABLE OF CONTENTS -->
<!-- ========================================== -->
<div class="meta-header">
  <h2>DESIGN PROJECT REPORT</h2>
  <p>TRANSLATING GLOBAL EVENTS INTO PERSONAL IMPACT INSIGHTS</p>
</div>

<h1 class="chapter-title" style="text-align: center; border-bottom: 2px solid #0f172a;">TABLE OF CONTENTS</h1>

<div style="margin-top: 15px;">
  <div class="toc-row toc-chapter"><span>Acknowledgement</span><span class="toc-page">iii</span></div>
  <div class="toc-row toc-chapter"><span>Abstract</span><span class="toc-page">iv</span></div>
  <div class="toc-row toc-chapter"><span>List of Abbreviations</span><span class="toc-page">v</span></div>
  
  <div class="toc-row toc-chapter"><span>1. INTRODUCTION</span><span class="toc-page">1</span></div>
  <div class="toc-row toc-sub"><span>1.1 Overview</span><span class="toc-page">1</span></div>
  <div class="toc-row toc-sub"><span>1.2 Motivation for the Project</span><span class="toc-page">2</span></div>
  <div class="toc-row toc-sub"><span>1.3 Problem Definition and Operational Scenarios</span><span class="toc-page">3</span></div>
  <div class="toc-row toc-sub2"><span>1.3.1 Scenario A: Strategic Analyst Tracking Maritime Bottlenecks</span><span class="toc-page">3</span></div>
  <div class="toc-row toc-sub2"><span>1.3.2 Scenario B: Agrarian Lifeline via 2G Button-Phone IVR Alerting</span><span class="toc-page">4</span></div>
  <div class="toc-row toc-sub2"><span>1.3.3 Scenario C: Multimodal Accessibility for Low-Vision Analysts</span><span class="toc-page">4</span></div>
  <div class="toc-row toc-sub"><span>1.4 Summary</span><span class="toc-page">5</span></div>

  <div class="toc-row toc-chapter"><span>2. LITERATURE REVIEW</span><span class="toc-page">6</span></div>
  <div class="toc-row toc-sub"><span>2.1 Introduction</span><span class="toc-page">6</span></div>
  <div class="toc-row toc-sub"><span>2.2 Survey of Existing Global Intelligence & Telemetry Frameworks</span><span class="toc-page">6</span></div>
  <div class="toc-row toc-sub"><span>2.3 International and Governmental Crisis Ingestion Registries</span><span class="toc-page">8</span></div>
  <div class="toc-row toc-sub"><span>2.4 Formal Taxonomy of Telemetry Barriers</span><span class="toc-page">9</span></div>
  <div class="toc-row toc-sub"><span>2.5 Research Gaps in Contemporary Planetary Systems</span><span class="toc-page">11</span></div>
  <div class="toc-row toc-sub"><span>2.6 Conclusion and Identified Scientific Gaps</span><span class="toc-page">12</span></div>

  <div class="toc-row toc-chapter"><span>3. PROJECT DESCRIPTION</span><span class="toc-page">13</span></div>
  <div class="toc-row toc-sub"><span>3.1 Objective of the Design Project Work</span><span class="toc-page">13</span></div>
  <div class="toc-row toc-sub"><span>3.2 Existing System and Critical Deficiencies</span><span class="toc-page">14</span></div>
  <div class="toc-row toc-sub"><span>3.3 Proposed System Architecture</span><span class="toc-page">15</span></div>
  <div class="toc-row toc-sub"><span>3.4 Deep-Dive Econometric Ripple Effect Modeling</span><span class="toc-page">17</span></div>
  <div class="toc-row toc-sub"><span>3.5 Benefits of the Proposed System</span><span class="toc-page">19</span></div>
  <div class="toc-row toc-sub"><span>3.6 Unique Innovation Features</span><span class="toc-page">20</span></div>
  <div class="toc-row toc-sub"><span>3.7 Summary</span><span class="toc-page">21</span></div>

  <div class="toc-row toc-chapter"><span>4. SYSTEM DESIGN</span><span class="toc-page">22</span></div>
  <div class="toc-row toc-sub"><span>4.1 Introduction</span><span class="toc-page">22</span></div>
  <div class="toc-row toc-sub"><span>4.2 Multi-Tier System Architecture</span><span class="toc-page">22</span></div>
  <div class="toc-row toc-sub2"><span>4.2.1 High-Resolution Architecture Diagram</span><span class="toc-page">23</span></div>
  <div class="toc-row toc-sub"><span>4.3 Algorithmic State Transition & Pipeline Execution Logic</span><span class="toc-page">24</span></div>
  <div class="toc-row toc-sub"><span>4.4 Advanced Shading & 3D WebGL Matrix Transformations</span><span class="toc-page">26</span></div>
  <div class="toc-row toc-sub"><span>4.5 Database Schema & Cryptographic Row Level Security</span><span class="toc-page">28</span></div>
  <div class="toc-row toc-sub"><span>4.6 Architectural Advantages</span><span class="toc-page">30</span></div>
  <div class="toc-row toc-sub"><span>4.7 Summary</span><span class="toc-page">30</span></div>

  <div class="toc-row toc-chapter"><span>5. PROJECT REQUIREMENTS</span><span class="toc-page">31</span></div>
  <div class="toc-row toc-sub"><span>5.1 Introduction</span><span class="toc-page">31</span></div>
  <div class="toc-row toc-sub"><span>5.2 Hardware and Software Specifications</span><span class="toc-page">31</span></div>
  <div class="toc-row toc-sub"><span>5.3 General System and Non-Functional Engineering Tolerances</span><span class="toc-page">33</span></div>
  <div class="toc-row toc-sub"><span>5.4 Constraints and Deployment Considerations</span><span class="toc-page">34</span></div>
  <div class="toc-row toc-sub"><span>5.5 Summary</span><span class="toc-page">35</span></div>

  <div class="toc-row toc-chapter"><span>6. MODULE DESCRIPTION</span><span class="toc-page">36</span></div>
  <div class="toc-row toc-sub"><span>6.1 Introduction</span><span class="toc-page">36</span></div>
  <div class="toc-row toc-sub"><span>6.2 Detailed Subsystem Engineering & Mathematical Models</span><span class="toc-page">36</span></div>
  <div class="toc-row toc-sub2"><span>6.2.1 3D Orbital WebGL Globe Subsystem</span><span class="toc-page">36</span></div>
  <div class="toc-row toc-sub2"><span>6.2.2 Real-Time RSS Ingestion & Sentiment Polarity Engine</span><span class="toc-page">38</span></div>
  <div class="toc-row toc-sub2"><span>6.2.3 Autonomous Threat & Crisis Severity Classifier</span><span class="toc-page">40</span></div>
  <div class="toc-row toc-sub2"><span>6.2.4 Future Impact Simulator & Global Impact DNA Matrix</span><span class="toc-page">42</span></div>
  <div class="toc-row toc-sub2"><span>6.2.5 Emergency Telecom & Multi-Channel Cellular Outreach Grid</span><span class="toc-page">44</span></div>
  <div class="toc-row toc-sub2"><span>6.2.6 Adaptive Persona Matrix & Accessibility Engine</span><span class="toc-page">46</span></div>
  <div class="toc-row toc-sub"><span>6.3 User Interface (UI) Architecture</span><span class="toc-page">47</span></div>
  <div class="toc-row toc-sub"><span>6.4 Technology Stack Synthesis</span><span class="toc-page">48</span></div>
  <div class="toc-row toc-sub"><span>6.5 Security Architecture & STRIDE Threat Analysis</span><span class="toc-page">49</span></div>
  <div class="toc-row toc-sub"><span>6.6 Summary</span><span class="toc-page">51</span></div>

  <div class="toc-row toc-chapter"><span>7. IMPLEMENTATION</span><span class="toc-page">52</span></div>
  <div class="toc-row toc-sub"><span>7.1 Introduction</span><span class="toc-page">52</span></div>
  <div class="toc-row toc-sub"><span>7.2 Phased Engineering Lifecycle</span><span class="toc-page">52</span></div>
  <div class="toc-row toc-sub"><span>7.3 Tools, Toolchains, and Environments</span><span class="toc-page">55</span></div>
  <div class="toc-row toc-sub"><span>7.4 Rigorous Algorithmic Challenges & Optimization Vectors</span><span class="toc-page">56</span></div>
  <div class="toc-row toc-sub"><span>7.5 Concrete Implementation Outcomes</span><span class="toc-page">58</span></div>
  <div class="toc-row toc-sub"><span>7.6 Summary</span><span class="toc-page">59</span></div>

  <div class="toc-row toc-chapter"><span>8. RESULT AND ANALYSIS</span><span class="toc-page">60</span></div>
  <div class="toc-row toc-sub"><span>8.1 Introduction</span><span class="toc-page">60</span></div>
  <div class="toc-row toc-sub"><span>8.2 Experimental Setup and Benchmarking Parameters</span><span class="toc-page">60</span></div>
  <div class="toc-row toc-sub"><span>8.3 In-Depth Empirical Benchmarking, p95/p99 Latency & Profiling</span><span class="toc-page">61</span></div>
  <div class="toc-row toc-sub"><span>8.4 Performance Metrics & Comparative Tables</span><span class="toc-page">63</span></div>
  <div class="toc-row toc-sub"><span>8.5 Planetary Crisis Case Studies (Validation Scenarios)</span><span class="toc-page">65</span></div>
  <div class="toc-row toc-sub2"><span>8.5.1 Case Study 1: Red Sea Maritime Shipping Disruption</span><span class="toc-page">65</span></div>
  <div class="toc-row toc-sub2"><span>8.5.2 Case Study 2: Eastern European Grain & Fertilizer Shock</span><span class="toc-page">66</span></div>
  <div class="toc-row toc-sub2"><span>8.5.3 Case Study 3: Trans-Pacific Subsea Telecommunications Severance</span><span class="toc-page">67</span></div>
  <div class="toc-row toc-sub"><span>8.6 Key Experimental Observations</span><span class="toc-page">68</span></div>
  <div class="toc-row toc-sub"><span>8.7 Summary</span><span class="toc-page">68</span></div>

  <div class="toc-row toc-chapter"><span>9. CONCLUSION AND FUTURE WORK</span><span class="toc-page">69</span></div>
  <div class="toc-row toc-sub"><span>9.1 Introduction</span><span class="toc-page">69</span></div>
  <div class="toc-row toc-sub"><span>9.2 Project Conclusion</span><span class="toc-page">69</span></div>
  <div class="toc-row toc-sub"><span>9.3 System Limitations</span><span class="toc-page">70</span></div>
  <div class="toc-row toc-sub"><span>9.4 Comprehensive Multi-Year Research & Engineering Roadmap</span><span class="toc-page">71</span></div>
  <div class="toc-row toc-sub"><span>9.5 Summary</span><span class="toc-page">73</span></div>

  <div class="toc-row toc-chapter"><span>10. INDIVIDUAL TEAM MODULE REPORT</span><span class="toc-page">74</span></div>
  <div class="toc-row toc-sub"><span>10.1 Individual Objectives</span><span class="toc-page">74</span></div>
  <div class="toc-row toc-sub"><span>10.2 Distribution of Engineering Roles</span><span class="toc-page">74</span></div>
  <div class="toc-row toc-sub"><span>10.3 Technical Contributions of Engineering Subsystems</span><span class="toc-page">75</span></div>
  <div class="toc-row toc-sub"><span>10.4 Engineering Skills Acquired and Applied</span><span class="toc-page">77</span></div>
  <div class="toc-row toc-sub"><span>10.5 Summary</span><span class="toc-page">78</span></div>

  <div class="toc-row toc-chapter"><span>APPENDIX: SYSTEM SPECIFICATIONS & MODULE ARCHITECTURE</span><span class="toc-page">79</span></div>
</div>
"""
