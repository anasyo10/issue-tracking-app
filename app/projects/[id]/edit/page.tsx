import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/ProjectForm"

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/projects">← Back to Projects</Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <div className="max-w-md">
        <ProjectForm projectId={Number.parseInt(id)} />
      </div>
    </div>
  )
}
