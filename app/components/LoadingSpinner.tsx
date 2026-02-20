export default function LoadingSpinner() {
  return (
    <div
      data-testid="loading-spinner"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
