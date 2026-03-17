"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  User,
  Brain,
  Info,
  Pencil,
  Trash2,
  Plus,
  Spade,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createScoringRule,
  updateScoringRule,
  deleteScoringRule,
} from "@/actions/lead-scoring"
import type { LeadScoringRule } from "@prisma/client"

interface SettingsTabsProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  } | null
  scoringRules: LeadScoringRule[]
}

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  member: "bg-gray-100 text-gray-700",
}

const FACTORS = [
  "interaction_count",
  "email_engagement",
  "meeting_attendance",
  "deal_value",
  "category",
  "last_interaction_days",
  "follow_up_completion",
  "linkedin_connection",
]

function ProfileTab({
  user,
}: {
  user: SettingsTabsProps["user"]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-white">
                {(user.name || user.email || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {user.name || "No name set"}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="grid gap-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">
                  {user.name || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge
                  className={ROLE_STYLES[user.role || "member"]}
                >
                  {(user.role || "member").charAt(0).toUpperCase() +
                    (user.role || "member").slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Not signed in</p>
        )}
      </CardContent>
    </Card>
  )
}

function LeadScoringTab({
  rules: initialRules,
}: {
  rules: LeadScoringRule[]
}) {
  const [rules, setRules] = useState(initialRules)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<LeadScoringRule | null>(null)
  const [factor, setFactor] = useState("")
  const [condition, setCondition] = useState("")
  const [points, setPoints] = useState("")
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditingRule(null)
    setFactor("")
    setCondition("")
    setPoints("")
    setDialogOpen(true)
  }

  function openEdit(rule: LeadScoringRule) {
    setEditingRule(rule)
    setFactor(rule.factor)
    setCondition(rule.condition)
    setPoints(String(rule.points))
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!factor || !condition || !points) {
      toast.error("All fields are required")
      return
    }

    setSaving(true)
    try {
      if (editingRule) {
        const updated = await updateScoringRule(editingRule.id, {
          factor,
          condition,
          points: parseInt(points, 10),
        })
        setRules((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        )
        toast.success("Rule updated")
      } else {
        const created = await createScoringRule({
          factor,
          condition,
          points: parseInt(points, 10),
        })
        setRules((prev) => [...prev, created])
        toast.success("Rule created")
      }
      setDialogOpen(false)
    } catch {
      toast.error("Failed to save rule")
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(rule: LeadScoringRule) {
    try {
      const updated = await updateScoringRule(rule.id, {
        isActive: !rule.isActive,
      })
      setRules((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      )
    } catch {
      toast.error("Failed to update rule")
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteScoringRule(id)
      setRules((prev) => prev.filter((r) => r.id !== id))
      toast.success("Rule deleted")
    } catch {
      toast.error("Failed to delete rule")
    }
  }

  function conditionSummary(condition: string): string {
    try {
      const parsed = JSON.parse(condition)
      return Object.entries(parsed)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    } catch {
      return condition
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Lead Scoring Rules
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button size="sm" onClick={openCreate} />
              }
            >
              <Plus className="h-4 w-4" />
              Add Rule
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingRule ? "Edit Rule" : "Add Scoring Rule"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Factor</Label>
                  <Select value={factor} onValueChange={(v) => setFactor(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select factor" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACTORS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Condition (JSON)</Label>
                  <Input
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder='{"min": 5}'
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : editingRule ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No scoring rules configured yet
          </p>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {rule.factor
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <Badge
                      className={
                        rule.points > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {rule.points > 0 ? "+" : ""}
                      {rule.points} pts
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {conditionSummary(rule.condition)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => handleToggle(rule)}
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => openEdit(rule)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AboutTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          About
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary">
              <Spade className="h-6 w-6 text-brand-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Golden Spades</h3>
              <p className="text-sm text-muted-foreground">
                CRM & Event Management Platform
              </p>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="font-mono text-sm">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Framework</span>
              <span className="text-sm">Next.js 16</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="text-sm">SQLite (Prisma ORM)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">UI</span>
              <span className="text-sm">shadcn/ui + Tailwind CSS v4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Charts</span>
              <span className="text-sm">Recharts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auth</span>
              <span className="text-sm">NextAuth.js</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SettingsTabs({ user, scoringRules }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="scoring">
          <Brain className="h-4 w-4" />
          Lead Scoring
        </TabsTrigger>
        <TabsTrigger value="about">
          <Info className="h-4 w-4" />
          About
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileTab user={user} />
      </TabsContent>

      <TabsContent value="scoring">
        <LeadScoringTab rules={scoringRules} />
      </TabsContent>

      <TabsContent value="about">
        <AboutTab />
      </TabsContent>
    </Tabs>
  )
}
