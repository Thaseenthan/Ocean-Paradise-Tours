export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-cyan-100">
        <span className="h-3 w-3 animate-ping rounded-full bg-cyan-300" />
        <span className="h-3 w-3 animate-ping rounded-full bg-sky-300 [animation-delay:200ms]" />
        <span className="h-3 w-3 animate-ping rounded-full bg-teal-300 [animation-delay:400ms]" />
        <p className="ml-2 text-sm">{label}</p>
      </div>
    </div>
  )
}
