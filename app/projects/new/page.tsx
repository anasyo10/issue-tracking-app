import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/ProjectForm"

export default function NewProjectPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/projects">← Back to Projects</Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Project</h1>
      </div>

      <div className="max-w-md">
        <ProjectForm />
      </div>
    </div>
  )
}
