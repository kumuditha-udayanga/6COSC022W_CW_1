"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Key, Plus, Trash2, Calendar, Shield } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ApiKey } from "@/lib/types"
import { useAuth } from "@/lib/auth-context";


export default function ApiKeysManager() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loadingKeys, setLoadingKeys] = useState(true)
  const [generating, setGenerating] = useState(false)

useEffect(() => {
  if (!isLoading && !user) {
    router.push("/login")
  } else if (user) {
    fetchApiKeys()
  }
}, [user, isLoading])

  const fetchApiKeys = async () => {
    try {
      const response = await api.getUserApiKeys(user!.user_id)
      setApiKeys(response);
    } catch (error: any) {
      toast.error("Failed to fetch API keys")
    } finally {
      setLoadingKeys(false)
    }
  }

  const generateApiKey = async () => {
    setGenerating(true)
    try {
      await api.genarateNewApiKey(user!.user_id)
      toast.success("API key generated successfully!")
      fetchApiKeys()
    } catch (error: any) {
      toast.error("Failed to generate API key")
    } finally {
      setGenerating(false)
    }
  }

  const deleteApiKey = async (apiKey: string, isActive: number) => {
    try {
      await api.deleteApiKey(user!.user_id, apiKey, isActive)
      toast.success("API key deleted successfully!")
      fetchApiKeys()
    } catch (error: any) {
      toast.error("Failed to delete API key")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("API key copied to clipboard!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">API Key Dashboard</h1>
              <p className="text-muted-foreground">
                Generate and manage your API keys
              </p>
            </div>
            <Button onClick={generateApiKey} disabled={generating}>
              <Plus className="h-4 w-4 mr-2" />
              {generating ? "Generating..." : "Generate New Key"}
            </Button>
          </div>

          {loadingKeys ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">Loading API keys...</div>
              </CardContent>
            </Card>
          ) : apiKeys.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
                  <p className="text-muted-foreground mb-4">You haven't generated any API keys yet.</p>
                  <Button onClick={generateApiKey} disabled={generating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Your First Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        <CardTitle className="text-lg">API Key</CardTitle>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {!key.is_active && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this API key? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteApiKey(key.api_key, key.is_active)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">API Key</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">{key.api_key}</code>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(key.api_key)}>
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Created:</span>
                        <span>{formatDate(key.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{formatDate(key.expires_at)}</span>
                      </div>
                    </div>

                    {key.is_active == 1 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <Shield className="h-4 w-4 inline mr-1" />
                          This is your active API key. It cannot be deleted while active.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
