import type { LoadingProps } from "../types/types";


export default function Loading({ text = "Carregando...", fullScreen = true }: LoadingProps) {
  return (
    <div className={`${fullScreen ? "min-h-screen" : ""} flex items-center justify-center bg-gray-50`}>
      <div className="flex flex-col items-center gap-3">
        <svg className="w-14 h-14 animate-spin text-orange-500" viewBox="0 0 24 24" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-gray-700 text-sm font-medium">{text}</p>
      </div>
    </div>
  );
}