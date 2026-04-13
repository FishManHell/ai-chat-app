"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

interface UserAvatarProps {
  name?: string | null
  image?: string | null
  className?: string
}

export function UserAvatar({ name, image, className }: Readonly<UserAvatarProps>) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <Avatar className={className}>
      {image && <AvatarImage src={image} alt={name ?? "User"} />}
      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
