import React, { useState } from 'react';
import {
  Bus,
  Home,
  Ticket,
  Radio,
  Navigation,
  Sparkles,
  Download,
  X,
  FileCode,
  Terminal,
  Check,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onStartBooking: () => void;
  onOpenLookup: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onStartBooking,
  onOpenLookup,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);

  const handleDownloadZip = () => {
    setIsDownloading(true);

    // Direct link to pre-packaged complete Python Flask ZIP
    const link = document.createElement('a');
    link.href = '/langihan-bus-terminal-python-flask.zip';
    link.download = 'langihan-bus-terminal-python-flask.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }, 1000);
  };

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        id="app-main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-[#0c121e] border-r border-slate-800 text-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-yellow-500/20">
                <Bus className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white font-display leading-tight">
                  Langihan Hub
                </h2>
                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                  Caraga & Davao Transit
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Terminal Live Status */}
          <div className="mx-3.5 my-3 p-3 rounded-xl bg-[#070a11] border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-[10px] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Hub Status
              </span>
              <span className="text-[10px] text-slate-400 font-mono">BXU-HUB</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Weather: 28°C Partly Sunny</span>
              <span className="text-emerald-400 font-bold">Low (24%)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-yellow-400/10 hover:text-yellow-300 transition-colors text-left"
            >
              <Home className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Dashboard & Schedules</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onStartBooking();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-yellow-400/10 hover:text-yellow-300 transition-colors text-left"
            >
              <Ticket className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Book Bus / Van Trip</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateHome();
                onClose();
                const elem = document.getElementById('dynamic-ergonomics-ticker');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-yellow-400/10 hover:text-yellow-300 transition-colors text-left"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Ergonomics & Travel Comfort</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenLookup();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-yellow-400/10 hover:text-yellow-300 transition-colors text-left"
            >
              <Navigation className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Find My Boarding Pass</span>
            </button>
          </nav>
        </div>

        {/* ========================================================
            BOTTOM OF THE SIDEBAR (As requested by the user)
            - Small download button (only the download icon, not obvious)
            - Light / Dark Mode switch
           ======================================================== */}
        <div className="p-3.5 border-t border-slate-800 bg-[#070a11]/60">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Appearance:</span>
              <ThemeToggle showLabel={false} />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowRunModal(true)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-yellow-400 hover:bg-slate-800 transition-colors"
                title="Local Run Guide"
                aria-label="Local Run Guide"
              >
                <Terminal className="w-4 h-4" />
              </button>

              {/* Small, discreet download button - only the download icon, not obvious */}
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isDownloading}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                title="Download project ZIP"
                aria-label="Download project ZIP"
                id="sidebar-download-zip-btn"
              >
                {downloadSuccess ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Download className={`w-4 h-4 ${isDownloading ? 'animate-pulse text-yellow-400' : ''}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Quick Setup Instructions Modal */}
      {showRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card modal-card w-full max-w-lg bg-[#0c121e] border border-yellow-500/30 rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-yellow-400" />
                <h3 className="text-base font-bold text-white font-display">
                  How to Run Locally (Python Flask)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRunModal(false)}
                className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                After downloading the ZIP file, extract it to your laptop and follow these simple steps:
              </p>

              <div className="p-3 rounded-xl bg-[#070a11] border border-slate-800 font-mono text-[11px] space-y-2 text-yellow-300">
                <div>
                  <span className="text-slate-500"># 1. Open terminal in project folder:</span>
                  <div className="text-white">cd langihan-bus-terminal-project</div>
                </div>
                <div>
                  <span className="text-slate-500"># 2. Install requirements:</span>
                  <div className="text-white">pip install -r requirements.txt</div>
                </div>
                <div>
                  <span className="text-slate-500"># 3. Start the Flask server:</span>
                  <div className="text-yellow-400 font-bold">python app.py</div>
                </div>
                <div>
                  <span className="text-slate-500"># 4. Open in browser:</span>
                  <div className="text-emerald-400">http://127.0.0.1:5000</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                You can also 1-click run with <code className="text-yellow-300 font-mono">./run.sh</code> (Mac/Linux) or <code className="text-yellow-300 font-mono">run.bat</code> (Windows).
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDownloadZip}
                className="btn-primary py-2 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP Now</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRunModal(false)}
                className="btn-secondary py-2 px-4 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
