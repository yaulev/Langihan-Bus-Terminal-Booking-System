import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = true,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`relative inline-flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 select-none shadow-sm border ${
        isDark
          ? 'bg-[#0c121e] border-slate-800 text-slate-200 hover:border-yellow-400 hover:text-yellow-300'
          : 'bg-white border-slate-200 text-slate-700 hover:border-yellow-500 hover:text-yellow-600 shadow-sm'
      } ${className}`}
    >
      {/* Icon with smooth rotate/scale animation */}
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-amber-600 transition-transform duration-300 -rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="hidden sm:inline font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}

      {/* Mode visual pill indicator */}
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          isDark ? 'bg-yellow-400' : 'bg-amber-500'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
