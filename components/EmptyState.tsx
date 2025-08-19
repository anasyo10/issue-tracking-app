import { FileX } from "lucide-react"

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center space-y-4 text-center max-w-md">
        <div className="rounded-full bg-muted p-4">
          <FileX className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  )
}
