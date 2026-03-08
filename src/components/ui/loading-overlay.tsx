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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "48px 0" }}>
      <AnimatedCircularProgressBar
        value={value}
        gaugePrimaryColor="#E81C3E"
        gaugeSecondaryColor="#2a2a2a"
        style={{ width: "96px", height: "96px", fontSize: "16px", color: "white" }}
      />
      <p style={{ fontSize: "14px", color: "#a1a1aa", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>{message}</p>
    </div>
  )
}
