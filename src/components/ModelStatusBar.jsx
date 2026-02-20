/**
 * ModelStatusBar — NyayaSetu
 * Shows AI model download status and a manual download button.
 * Stays visible at the bottom of the screen.
 */
import React, { useState } from 'react';
import { Download, CheckCircle2, Loader2, AlertCircle, ChevronUp, ChevronDown, Cpu, Wifi } from 'lucide-react';
import { useModelStatus } from './ModelLoaderProvider.jsx';

const STATUS_CONFIG = {
  not_downloaded: {
    label: 'AI Model Not Downloaded',
    sublabel: '~200MB · LFM2 350M Q4',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/5',
    dotColor: 'bg-yellow-400',
    icon: null,
  },
  downloading: {
    label: 'Downloading Model',
    sublabel: 'Please keep the app open',
    color: 'text-[#00d4ff]',
    borderColor: 'border-[#00d4ff]/30',
    bgColor: 'bg-[#00d4ff]/5',
    dotColor: 'bg-[#00d4ff] animate-pulse',
    icon: Loader2,
  },
  loading: {
    label: 'Loading into Memory',
    sublabel: 'Almost ready...',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
    dotColor: 'bg-purple-400 animate-pulse',
    icon: Loader2,
  },
  ready: {
    label: 'AI Model Ready',
    sublabel: 'On-device inference active',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/5',
    dotColor: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  error: {
    label: 'Download Failed',
    sublabel: 'Check connection and retry',
    color: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/5',
    dotColor: 'bg-red-400',
    icon: AlertCircle,
  },
};

export default function ModelStatusBar() {
  const { modelStatus, progress, message, error, downloadAndLoad, isProcessing, sdkReady } = useModelStatus();
  const [expanded, setExpanded] = useState(false);

  const config = STATUS_CONFIG[modelStatus] ?? STATUS_CONFIG.not_downloaded;
  const StatusIcon = config.icon;
  const pct = Math.round(progress * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="pointer-events-auto max-w-sm ml-auto mr-4 mb-4 shadow-2xl">

        {/* Collapsed bar */}
        <div
          className={`border ${config.borderColor} ${config.bgColor} backdrop-blur-xl cursor-pointer select-none`}
          onClick={() => setExpanded(e => !e)}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Animated status dot */}
            <div className="relative shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
              {isProcessing && (
                <div className={`absolute inset-0 rounded-full ${config.dotColor} opacity-40 animate-ping`} />
              )}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-mono font-bold tracking-widest uppercase ${config.color} truncate`}>
                {config.label}
              </div>
              {isProcessing && (
                <div className="h-0.5 bg-white/10 mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#00d4ff] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>

            {/* Status icon / percentage */}
            <div className="flex items-center gap-2 shrink-0">
              {isProcessing && <span className="text-xs font-mono text-[#00d4ff]">{pct}%</span>}
              {StatusIcon && (
                <StatusIcon className={`w-4 h-4 ${config.color} ${isProcessing ? 'animate-spin' : ''}`} />
              )}
              <div className="text-gray-600">
                {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded panel */}
        {expanded && (
          <div className={`border-x border-b ${config.borderColor} bg-black/95 backdrop-blur-xl px-4 pt-4 pb-5 space-y-4`}>

            {/* Model info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-mono tracking-wider">LFM2 350M (Q4_K_M) · ~200MB</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Wifi className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-mono tracking-wider">
                  {modelStatus === 'ready'
                    ? 'Runs 100% offline after download'
                    : 'One-time download ~200MB required'}
                </span>
              </div>
            </div>

            {/* Progress detail */}
            {isProcessing && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span className="uppercase tracking-widest truncate">{message || config.sublabel}</span>
                  <span className={config.color}>{pct}%</span>
                </div>
                <div className="h-1 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#00d4ff] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-400 text-[11px] font-mono leading-relaxed">{error}</p>
            )}

            {/* Status message when ready */}
            {modelStatus === 'ready' && !isProcessing && (
              <div className="text-[11px] font-mono text-gray-500 leading-relaxed">
                {message || config.sublabel}
              </div>
            )}

            {/* Download button */}
            {(modelStatus === 'not_downloaded' || modelStatus === 'error') && sdkReady && (
              <button
                onClick={(e) => { e.stopPropagation(); downloadAndLoad(); }}
                className="w-full flex items-center justify-center gap-3 py-3 border border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff] hover:text-black transition-all font-mono text-xs font-bold tracking-widest uppercase"
              >
                <Download className="w-4 h-4" />
                {modelStatus === 'error' ? 'Retry Download' : 'Download AI Model'}
              </button>
            )}

            {/* Initializing SDK note */}
            {!sdkReady && (
              <div className="flex items-center gap-2 text-gray-600 text-[11px] font-mono">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Initializing runtime...</span>
              </div>
            )}

            {/* Downloaded checkmark */}
            {modelStatus === 'ready' && (
              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Downloaded &amp; cached · Offline ready</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
