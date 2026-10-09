with open("c:/Users/Sumanth/OneDrive/Desktop/Global-Intel-Telemetry/frontend/src/components/Navbar.jsx", "r", encoding="utf-8") as f:
    nav = f.read()

# Add FileText to imports
nav = nav.replace("  MapPin\n} from 'lucide-react';", "  MapPin,\n  FileText\n} from 'lucide-react';")

# Add Download button next to World Explorer
target_btn = """              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">3D</span>
            </button>
          </div>"""

replacement_btn = """              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">3D</span>
            </button>

            <a
              href="/LT_Techgium_Abstract_Sumanth_Duraimurugan.pdf"
              download="LT_Techgium_Abstract_Sumanth_Duraimurugan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
              title="Download L&T Techgium Abstract (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">L&amp;T Abstract</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">PDF</span>
            </a>
          </div>"""

nav = nav.replace(target_btn, replacement_btn)

with open("c:/Users/Sumanth/OneDrive/Desktop/Global-Intel-Telemetry/frontend/src/components/Navbar.jsx", "w", encoding="utf-8") as f:
    f.write(nav)

print("Navbar.jsx patched successfully!")
