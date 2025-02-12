"use client"

import {
  CircleDollarSign,
  Handshake,
  User,
  Users,
  Box,
  Activity,
} from "lucide-react"
import { useMembers } from "../../members/_hooks/useMembers"
import { demoModels, useModels } from "../../models/_hooks/useModels"
import {
  demoDeployments,
  useDeployments,
} from "../../deployments/_hooks/useDeployments"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts"
import type { Statistics } from "../../_types"
import { Hero } from "../Hero/Hero"
import { StatsCard } from "../StatsCard/StatsCard"
import { useMemo } from "react"

export function OverviewContent() {
  const { members } = useMembers()
  const { models } = useModels()
  const { deployments } = useDeployments({})

  // Calculate activity data based on creation dates
  const activityData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - i))
      return {
        date: new Date(date),
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
      }
    })

    return last7Days.map(({ date, label }) => {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      // Include demo deployments in the count
      const deploymentCount = [...demoDeployments, ...deployments].filter(
        (d) => {
          const createdAt = new Date(d.createdAt || "")
          return createdAt >= startOfDay && createdAt <= endOfDay
        }
      ).length

      // Include demo models in the count
      const modelCount = [...demoModels, ...models].filter((m) => {
        const createdAt = new Date(m.createdAt || "")
        return createdAt >= startOfDay && createdAt <= endOfDay
      }).length

      return {
        name: label,
        deployments: deploymentCount,
        models: modelCount,
      }
    })
  }, [deployments, models])

  // Calculate role distribution from actual members
  const roleDistributionData = useMemo(() => {
    const roleCounts = new Map<string, number>()

    members.forEach((member) => {
      member.roles?.forEach((role) => {
        const count = roleCounts.get(role.name || "") || 0
        roleCounts.set(role.name || "", count + 1)
      })
    })

    return Array.from(roleCounts.entries()).map(([role, count]) => ({
      role,
      count,
    }))
  }, [members])

  const activeDeployments = deployments.filter(
    (d) => d.status?.status === "STATUS_ALL_COMPONENTS_READY"
  ).length

  const activeMembers = members.filter((member) =>
    member.roles?.some(
      (role) => role.name === "Developer" || role.name === "Admin"
    )
  )

  return (
    <section className="flex flex-col gap-6">
      <Hero isLoading={false} />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          icon={<Users className="size-4 text-muted-foreground" />}
          number={members.length}
          title="Total Members"
        />
        <StatsCard
          icon={<Box className="size-4 text-muted-foreground" />}
          number={models.length}
          title="Total Models"
        />
        <StatsCard
          icon={<Activity className="size-4 text-muted-foreground" />}
          number={activeDeployments}
          title="Active Deployments"
        />
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>
              Model and deployment activity over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={activityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="deployments"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="models"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Composition</CardTitle>
            <CardDescription>Distribution of team roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={roleDistributionData}>
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Members</CardTitle>
            <CardDescription>Members with active roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <img
                    src={member.avatar?.url}
                    alt={member.name || ""}
                    className="size-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.roles?.map((role) => role.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: "New model deployed by John Doe", time: "2 hours ago" },
                { text: "System update completed", time: "5 hours ago" },
                { text: "New team member added", time: "1 day ago" },
                {
                  text: "Performance optimization completed",
                  time: "2 days ago",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-sm">{activity.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
