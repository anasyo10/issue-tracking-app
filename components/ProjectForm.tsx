"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Projects } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

interface ProjectFormProps {
  projectId?: number;
}

export function ProjectForm({ projectId }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEditing =
    typeof projectId === "number" && projectId > 0 && !isNaN(projectId);

  useEffect(() => {
    if (isEditing && projectId) {
      loadProject();
    }
  }, [projectId, isEditing]);

  const loadProject = async () => {
    if (!isEditing || !projectId || projectId <= 0 || isNaN(projectId)) {
      return;
    }

    try {
      setInitialLoading(true);
      setError(null);
      const project = await Projects.get(projectId);
      setName(project.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const data = { name: name.trim() };

      if (isEditing && projectId) {
        await Projects.update(projectId, data);
      } else {
        await Projects.create(data);
      }

      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEditing ? "update" : "create"} project`
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
          {isEditing ? "Edit Project" : "Create New Project"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading
                ? "..."
                : isEditing
                ? "Update Project"
                : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/projects")}
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
