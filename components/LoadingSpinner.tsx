export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center p-12"
      data-testid="loading-spinner"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary"></div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
