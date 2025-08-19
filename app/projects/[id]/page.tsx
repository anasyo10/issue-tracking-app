import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IssueTable } from "@/components/IssueTable"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Projects } from "@/lib/api"
import { ErrorMessage } from "@/components/ErrorMessage"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const projectId = Number.parseInt(id)

  let project
  try {
    project = await Projects.get(projectId)
  } catch (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorMessage message="Failed to load project" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/projects">← Back to Projects</Link>
        </Button>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Issues</h2>
          <p className="text-muted-foreground">Track and manage project issues</p>
        </div>
        <Button asChild>
          <Link href={`/projects/${projectId}/issues/new`}>+ Create a new issue</Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <IssueTable projectId={projectId} />
      </Suspense>
    </div>
  )
}
