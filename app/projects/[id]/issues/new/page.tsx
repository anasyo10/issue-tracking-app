import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IssueForm } from "@/components/IssueForm"

interface NewIssuePageProps {
  params: Promise<{ id: string }>
}

export default async function NewIssuePage({ params }: NewIssuePageProps) {
  const { id } = await params
  const projectId = Number.parseInt(id)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href={`/projects/${projectId}`}>← Back to Project</Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Issue</h1>
      </div>

      <div className="max-w-2xl">
        <IssueForm projectId={projectId} />
      </div>
    </div>
  )
}
