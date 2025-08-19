import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IssueForm } from "@/components/IssueForm";
import { Comments } from "@/components/Comments";
import { ArrowLeft } from "lucide-react";

interface EditIssuePageProps {
  params: Promise<{ id: string; issueId: string }>;
}

export default async function EditIssuePage({ params }: EditIssuePageProps) {
  const { id, issueId } = await params;
  const projectId = Number.parseInt(id);
  const issueIdNum = Number.parseInt(issueId);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Issue</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <IssueForm projectId={projectId} issueId={issueIdNum} />
        </div>
        <div className="space-y-6">
          <Comments issueId={issueIdNum} />
        </div>
      </div>
    </div>
  );
}
