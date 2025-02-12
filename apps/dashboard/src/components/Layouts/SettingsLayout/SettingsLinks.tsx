import { Accordion } from "@package/ui/accordion"
import { Logo } from "@package/ui/logo"
import { Separator } from "@package/ui/separator"
import { Typography } from "@package/ui/typography"
import {
  Home,
  Receipt,
  Shield,
  User,
  Users,
  FileText,
  Rocket,
  CreditCard,
  Settings,
} from "lucide-react"
import Link from "next/link"

import { SettingsLink } from "./SettingsLink"

type LinksProps = {
  onLinkClick?: () => void
}

export function SettingsLinks({ onLinkClick }: LinksProps) {
  return (
    <nav className="flex h-full flex-col content-between gap-2 text-base font-medium lg:items-start lg:px-4 lg:font-medium">
      <Link
        className="mb-4 flex items-center gap-2 text-lg font-semibold lg:hidden"
        href="/"
        onClick={onLinkClick}
      >
        <Logo color="currentColor" />
      </Link>
      <Accordion
        collapsible
        className="flex size-full flex-col gap-12"
        type="single"
      >
        <section className="flex flex-col gap-2">
          <SettingsLink
            icon={<User className="size-5" />}
            links={[{ href: "/settings/profile", text: "Profile" }]}
            onClick={onLinkClick}
          />
          <SettingsLink
            icon={<Users className="size-5" />}
            links={[{ href: "/settings/team", text: "Team" }]}
            onClick={onLinkClick}
          />
          <SettingsLink
            icon={<CreditCard className="size-5" />}
            links={[{ href: "/settings/billing", text: "Billing" }]}
            onClick={onLinkClick}
          />
          <SettingsLink
            icon={<Rocket className="size-5" />}
            links={[{ href: "/settings/deployment", text: "Deployment" }]}
            onClick={onLinkClick}
          />
          <SettingsLink
            icon={<Settings className="size-5" />}
            links={[{ href: "/settings/appearance", text: "Appearance" }]}
            onClick={onLinkClick}
          />
        </section>
      </Accordion>
    </nav>
  )
}
