"use client"

import { useState, useEffect } from "react"
import { Input } from "@package/ui/input"
import { SearchIcon } from "lucide-react"
import { cn } from "@package/utils"
import { Button } from "@package/ui/button"
import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"

type SearchInputProps = {
  placeholder?: string
  className?: string
  parentPath?: string
  searchParam?: string
  initialSearch?: string
}

export function MembersSearchInput({
  placeholder = "Search members...",
  className,
  parentPath = "/members",
  searchParam = "search",
  initialSearch = "",
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState<string>(initialSearch)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setInputValue(initialSearch)
  }, [initialSearch])

  const handleSearch = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue.length === 0) {
      // Remove the search parameter if input is empty
      const params = new URLSearchParams(searchParams.toString())
      params.delete(searchParam)
      router.push(`${parentPath}?${params.toString()}`)
    } else {
      router.push(
        `${parentPath}?${searchParam}=${encodeURIComponent(trimmedValue)}`
      )
    }
  }

  const handleClear = () => {
    setInputValue("")
    // Remove the search parameter from URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete(searchParam)
    router.push(`${parentPath}?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <AnimatePresence>
        {inputValue.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <Button variant="ghost" size="icon" onClick={handleClear}>
              <XIcon className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
