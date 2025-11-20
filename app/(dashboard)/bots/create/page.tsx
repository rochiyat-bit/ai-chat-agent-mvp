"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    system_prompt: "You are a helpful AI assistant. Answer questions professionally and try to capture lead information when appropriate.",
    provider: "openrouter" as "openrouter" | "agentrouter",
    model: "anthropic/claude-3.5-sonnet",
    temperature: 0.7,
    max_tokens: 1000,
  });

  // Load models when provider changes
  useEffect(() => {
    fetchModels(formData.provider);
  }, [formData.provider]);

  const fetchModels = async (provider: string) => {
    setLoadingModels(true);
    try {
      const response = await fetch(`/api/providers/models?provider=${provider}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.models);
        // Set first model as default
        if (data.models.length > 0) {
          setFormData((prev) => ({ ...prev, model: data.models[0] }));
        }
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create bot");
        return;
      }

      const bot = await response.json();
      router.push(`/bots/${bot.id}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Bot</h1>
          <p className="text-gray-600 mt-1">Configure your AI chat agent</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bot Configuration</CardTitle>
            <CardDescription>
              Set up your bot's personality and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Bot Name *</Label>
                <Input
                  id="name"
                  placeholder="Customer Support Bot"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Helps customers with common questions"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system_prompt">System Prompt *</Label>
                <Textarea
                  id="system_prompt"
                  placeholder="You are a helpful AI assistant..."
                  value={formData.system_prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, system_prompt: e.target.value })
                  }
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This defines your bot's personality and behavior
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider *</Label>
                <select
                  id="provider"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      provider: e.target.value as "openrouter" | "agentrouter",
                    })
                  }
                >
                  <option value="openrouter">OpenRouter (Claude, GPT, Gemini)</option>
                  <option value="agentrouter">Agent Router (Multi-model)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  {formData.provider === "openrouter"
                    ? "Access multiple AI models through OpenRouter"
                    : "Access AI models through Agent Router"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model *</Label>
                  <select
                    id="model"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    disabled={loadingModels}
                  >
                    {loadingModels ? (
                      <option>Loading models...</option>
                    ) : (
                      availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    {formData.provider === "agentrouter"
                      ? "Models provided by Agent Router"
                      : "Models from various providers"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">
                    Temperature: {formData.temperature}
                  </Label>
                  <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        temperature: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher = more creative, Lower = more focused
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || loadingModels}>
                  {loading ? "Creating..." : "Create Bot"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
