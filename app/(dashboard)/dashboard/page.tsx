"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Bot, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

interface BotData {
  id: string;
  name: string;
  description: string | null;
  total_conversations: number;
  total_messages: number;
  is_active: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await fetch("/api/bots");
      if (response.ok) {
        const data = await response.json();
        setBots(data);
      }
    } catch (error) {
      console.error("Error fetching bots:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalConversations = bots.reduce((sum, bot) => sum + bot.total_conversations, 0);
  const totalMessages = bots.reduce((sum, bot) => sum + bot.total_messages, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your AI chat agents</p>
          </div>
          <Link href="/bots/create">
            <Button>Create New Bot</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bots.length}</div>
              <p className="text-xs text-muted-foreground">
                {bots.filter(b => b.is_active).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                Across all bots
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                Total messages sent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bots List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bots</CardTitle>
            <CardDescription>
              Manage and monitor your AI chat agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : bots.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bots yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first AI chat agent
                </p>
                <Link href="/bots/create">
                  <Button>Create Your First Bot</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bots.map((bot) => (
                  <div
                    key={bot.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/bots/${bot.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{bot.name}</h3>
                        {bot.is_active && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      {bot.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {bot.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{bot.total_conversations} conversations</span>
                        <span>{bot.total_messages} messages</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/bots/${bot.id}`);
                    }}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
