interface ErrorBannerProps {
  error: string | null;
}

export default function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {error}
    </div>
  );
}
