// src/components/branding/VersionBadge.jsx

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const APP_VERSION = `v${__APP_VERSION__}`;
export default function VersionBadge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("dismissed-version");
    if (dismissed !== APP_VERSION) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("dismissed-version", APP_VERSION);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 right-3 z-[9999]">
      <div className="flex items-stretch rounded-full bg-[#111] font-mono text-[10px] font-medium text-[#ddd] overflow-hidden">
        <div className="flex items-center gap-[5px] px-[9px] py-1">
          <span className="relative w-[5px] h-[5px] rounded-full border border-emerald-400 flex-shrink-0">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2.5px] h-[2.5px] rounded-full bg-emerald-400" />
          </span>
          <span>{APP_VERSION}</span>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="flex items-center px-[7px] bg-white/[0.06] border-l border-white/[0.08] text-white/35 hover:bg-white/[0.12] hover:text-white/90 transition-colors"
        >
          <X size={10} />
        </button>
      </div>
    </div>
  );
}
