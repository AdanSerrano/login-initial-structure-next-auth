import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Eye, EyeOff } from "lucide-react"

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
  return (
    <Input
    type={showPassword ? "text" : "password"}
    suffix= {
        showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" onClick={() => setShowPassword(false)}/> : <Eye className="h-4 w-4 text-muted-foreground" onClick={() => setShowPassword(true)}/>
    }
      className={cn(className)}
      {...props}
      ref={ref}
    />
  )
})

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }