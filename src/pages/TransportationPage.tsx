import { Link } from 'react-router-dom'
import { TransportationSection } from '@/components/transportation/TransportationSection'

export function TransportationPage() {
  return (
    <main data-page="transportation" className="relative min-h-screen bg-[#05040a] text-white w-full max-w-full overflow-x-hidden">
      {/* Top Floating Cyber Nav Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4 bg-[#05040a]/85 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 text-cyan-400 hover:text-cyan-300 transition-colors group min-w-0"
        >
          <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all shrink-0 text-xs sm:text-sm">
            ←
          </span>
          <span className="font-['Orbitron'] font-bold text-xs sm:text-sm tracking-wider sm:tracking-widest text-slate-200 group-hover:text-white truncate">
            RETURN TO CITY
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/about"
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-['Orbitron'] tracking-wider rounded border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all"
          >
            ABOUT
          </Link>
          <Link
            to="/credentials"
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-['Orbitron'] tracking-wider rounded border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all"
          >
            CREDENTIALS
          </Link>
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-['Orbitron'] tracking-wider sm:tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-400/40 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            TRANSPORT
          </span>
        </div>
      </header>

      {/* Main Transportation Content */}
      <div className="w-full max-w-full overflow-x-hidden">
        <TransportationSection />
      </div>
    </main>
  )
}
