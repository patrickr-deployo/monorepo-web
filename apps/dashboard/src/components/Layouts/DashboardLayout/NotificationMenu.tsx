"use client"

import { useState } from "react"
import { Bell, CheckCheck, Info, AlertCircle } from "lucide-react"
import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@package/ui/tooltip"
import { Typography } from "@package/ui/typography"
import { Badge } from "@package/ui/badge"
import { useToast } from "@package/ui/toast"
import { ScrollArea } from "@package/ui/scroll-area"

const DEMO_NOTIFICATIONS = [
  {
    id: "1",
    title: "Demo Notification",
    desc: "This is a demo notification with normal priority",
    level: 0,
    hasRead: false,
  },
  {
    id: "2", 
    title: "Warning Notification",
    desc: "This is a demo warning notification",
    level: 1000,
    hasRead: false,
  },
  {
    id: "3",
    title: "Critical Alert",
    desc: "This is a demo critical notification",
    level: 2000,
    hasRead: true,
  },
];

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.hasRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, hasRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, hasRead: true })));
  };

  const getNotificationIcon = (level: number) => {
    switch (level) {
      case 2000:
        return (
          <AlertCircle
            data-testid="notification-icon"
            className="h-4 w-4 text-red-500"
          />
        )
      case 1000:
        return (
          <CheckCheck
            data-testid="notification-icon"
            className="h-4 w-4 text-yellow-500"
          />
        )
      default:
        return (
          <Info
            data-testid="notification-icon"
            className="h-4 w-4 text-blue-500"
          />
        )
    }
  }

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="rounded-full size-8" variant="outline">
                <div className="relative">
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-2 -top-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <span className="sr-only">Toggle notification menu</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  className="h-auto p-0 text-xs"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex items-start gap-2 p-3 cursor-pointer"
                      onClick={() => !notification.hasRead && markAsRead(notification.id)}
                    >
                      {getNotificationIcon(notification.level)}
                      <div className="flex-1">
                        <Typography variant="small" className="font-medium">
                          {notification.title + " "}
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-muted-foreground"
                        >
                          {notification.desc}
                        </Typography>
                      </div>
                      {!notification.hasRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="bottom">
          <Typography variant="body">Notifications</Typography>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
