"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Issues } from "@/lib/api";
import type { Issue } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { EmptyState } from "@/components/EmptyState";
import { Edit, Trash2 } from "lucide-react";

interface IssueTableProps {
  projectId: number;
}

const statusLabels = {
  to_do: "To do",
  active: "Active",
  on_hold: "On hold",
  resolved: "Resolved",
} as const;

const statusVariants = {
  to_do: "secondary",
  active: "default",
  on_hold: "outline",
  resolved: "secondary",
} as const;

export function IssueTable({ projectId }: IssueTableProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadIssues();
  }, [projectId]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await Issues.list(projectId);
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setDeletingId(id);
      await Issues.destroy(projectId, id);
      setIssues(issues.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete issue");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (issues.length === 0)
    return (
      <EmptyState message="No issues found. Create your first issue to get started." />
    );

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b bg-muted/50">
                <div className="min-w-[60px]">No</div>
                <div className="min-w-[200px]">Title</div>
                <div className="min-w-[120px]">Date Created</div>
                <div className="min-w-[120px]">Assigned To</div>
                <div className="min-w-[100px]">Status</div>
                <div className="min-w-[180px]">Actions</div>
              </div>
              {issues.map((issue, index) => (
                <div
                  key={issue.id}
                  className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="text-sm text-muted-foreground font-mono min-w-[60px]">
                    #{index + 1}
                  </div>
                  <div
                    className="font-medium min-w-[200px] truncate"
                    title={issue.title}
                  >
                    {issue.title}
                  </div>
                  <div className="text-sm text-muted-foreground min-w-[120px]">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </div>
                  <div
                    className="text-sm min-w-[120px] truncate"
                    title={issue.assigned_to}
                  >
                    {issue.assigned_to}
                  </div>
                  <div className="min-w-[100px]">
                    <Badge variant={statusVariants[issue.status]}>
                      {statusLabels[issue.status]}
                    </Badge>
                  </div>
                  <div className="flex gap-2 min-w-[180px]">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/projects/${projectId}/issues/${issue.id}/edit`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(issue.id, issue.title)}
                      disabled={deletingId === issue.id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {issues.map((issue, index) => (
          <Card key={issue.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg leading-tight break-words">
                    {issue.title}
                  </CardTitle>
                  <div className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
                    #{index + 1}
                  </div>
                </div>
                <Badge
                  variant={statusVariants[issue.status]}
                  className="shrink-0"
                >
                  {statusLabels[issue.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Assigned to:
                  </span>
                  <span className="font-medium">{issue.assigned_to}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    Created:
                  </span>
                  <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 min-h-[44px] justify-center"
                >
                  <Link href={`/projects/${projectId}/issues/${issue.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Issue
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(issue.id, issue.title)}
                  disabled={deletingId === issue.id}
                  className="flex-1 min-h-[44px] justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deletingId === issue.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
