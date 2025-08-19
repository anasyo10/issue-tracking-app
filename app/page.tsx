import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectList } from "@/components/ProjectList"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects and track issues</p>
        </div>
        <Button asChild>
          <Link href="/projects/new">+ Create new project</Link>
        </Button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}
