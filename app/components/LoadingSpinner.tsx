export default function LoadingSpinner() {
  return (
    <div data-testid="loading-spinner" className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
