import { AnimatedCircularProgressBar } from "./animated-circular-progress-bar"
import { useEffect, useState } from "react"

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Carregando..." }: LoadingOverlayProps) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(v => {
        if (v >= 95) return v
        return v + Math.random() * 8
      })
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <AnimatedCircularProgressBar
        value={value}
        gaugePrimaryColor="#E81C3E"
        gaugeSecondaryColor="#2a2a2a"
        className="size-24 text-base text-white"
      />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  )
}
