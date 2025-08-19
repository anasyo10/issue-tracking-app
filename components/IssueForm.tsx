"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Issues } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import type { Issue } from "@/types";

interface IssueFormProps {
  projectId: number;
  issueId?: number;
}

const statusOptions = [
  { value: "to_do", label: "To do" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "resolved", label: "Resolved" },
] as const;

export function IssueForm({ projectId, issueId }: IssueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState<Issue["status"]>("to_do");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!issueId);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEditing = !!issueId;

  useEffect(() => {
    if (issueId) {
      loadIssue();
    }
  }, [issueId]);

  const loadIssue = async () => {
    if (!issueId) return;

    try {
      setInitialLoading(true);
      setError(null);
      const issue = await Issues.get(projectId, issueId);
      setTitle(issue.title);
      setDescription(issue.description);
      setAssignedTo(issue.assigned_to);
      setStatus(issue.status);
      setCreatedAt(issue.created_at);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issue");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const data = {
        title: title.trim(),
        description: description.trim(),
        assigned_to: assignedTo.trim(),
        status,
      };

      if (isEditing && issueId) {
        await Issues.update(projectId, issueId, data);
        toast.success("Issue updated successfully!");
      } else {
        await Issues.create(projectId, data);
        router.push(`/projects/${projectId}`);
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEditing ? "update" : "create"} issue`
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? `Edit ${title}` : "Create New Issue"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <ErrorMessage message={error} />}

        {isEditing && (
          <div className="text-md font-bold mb-4">
            <span className="text-gray-500">Created At:</span>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter issue title"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter issue description"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_to">Assigned To</Label>
            <Input
              id="assigned_to"
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Enter assignee name"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Issue["status"])}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !title.trim() || !assignedTo.trim()}
            >
              {loading ? "..." : isEditing ? "Update Issue" : "Create Issue"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/projects/${projectId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
