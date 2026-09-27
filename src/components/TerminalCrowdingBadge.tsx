import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle, Flame, Clock } from 'lucide-react';

export type CrowdingLevel = 'Low' | 'Moderate' | 'High';

interface TerminalCrowdingBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export const TerminalCrowdingBadge: React.FC<TerminalCrowdingBadgeProps> = ({
  className = '',
  showDetails = false,
}) => {
  // Compute dynamic crowding level based on current hour in Philippine Time
  const [level, setLevel] = useState<CrowdingLevel>('Moderate');
  const [percentage, setPercentage] = useState<number>(55);
  const [waitEstimate, setWaitEstimate] = useState<string>('5–10 mins');

  useEffect(() => {
    const updateCrowding = () => {
      const hour = new Date().getHours();
      // Rush hours: 6am–8:30am (Morning exodus to Davao/Surigao), 4pm–6:30pm (Evening rush)
      if ((hour >= 6 && hour <= 8) || (hour >= 16 && hour <= 18)) {
        setLevel('High');
        setPercentage(84);
        setWaitEstimate('15–20 mins (Queue at Security & Bays)');
      } else if ((hour >= 9 && hour <= 15)) {
        setLevel('Moderate');
        setPercentage(52);
        setWaitEstimate('5–8 mins (Steady Passenger Flow)');
      } else {
        setLevel('Low');
        setPercentage(24);
        setWaitEstimate('1–3 mins (Fast Boarding & Direct Access)');
      }
    };

    updateCrowding();
    const interval = setInterval(updateCrowding, 60000);
    return () => clearInterval(interval);
  }, []);

  const badgeConfig = {
    Low: {
      bgColor: 'bg-emerald-500/15',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: CheckCircle,
      desc: 'Minimal waiting lines at ticketing and departure bays. Optimal physical ergonomics and low noise.',
    },
    Moderate: {
      bgColor: 'bg-yellow-500/15',
      borderColor: 'border-yellow-500/40',
      textColor: 'text-yellow-400',
      dotColor: 'bg-yellow-400',
      icon: Users,
      desc: 'Regular passenger movement. Seating available in aircooled waiting lounge.',
    },
    High: {
      bgColor: 'bg-red-500/15',
      borderColor: 'border-red-500/40',
      textColor: 'text-red-400',
      dotColor: 'bg-red-400',
      icon: Flame,
      desc: 'Peak passenger volume. Proceed directly to designated Bay 20 minutes prior to departure.',
    },
  }[level];

  const Icon = badgeConfig.icon;

  return (
    <div
      className={`inline-flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-2xl border ${badgeConfig.borderColor} ${badgeConfig.bgColor} backdrop-blur-md ${className}`}
      role="status"
      aria-label={`Terminal Congestion: ${level}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeConfig.dotColor}`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${badgeConfig.dotColor}`}
            ></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Terminal Crowding:
          </span>
          <span className={`text-xs font-black uppercase tracking-wider ${badgeConfig.textColor}`}>
            {level} Congestion ({percentage}%)
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Avg Wait: {waitEstimate.split(' ')[0]}</span>
        </div>
      </div>

      {showDetails && (
        <div className="text-[11px] text-slate-400 border-t border-white/5 pt-1.5 mt-0.5 leading-relaxed">
          <span className="text-yellow-400 font-medium">Terminal Ergonomics: </span>
          {badgeConfig.desc}
        </div>
      )}
    </div>
  );
};

export default TerminalCrowdingBadge;
