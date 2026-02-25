"use client"
import React, { useEffect, useState } from "react"
import { cn } from "../../lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export const Meteors = ({
  number = 50,
  minDelay = 0.2,
  maxDelay = 2.5,
  minDuration = 4,
  maxDuration = 14,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg",
      top: "-5%",
      left: `calc(0% + ${Math.floor(Math.random() * window.innerWidth)}px)`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration: Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + "s",
    }))
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  const getColors = (idx: number) => {
    const mod = idx % 3
    if (mod === 0) return { head: "bg-[#FF0050] shadow-[0_0_6px_#FF0050]", tail: "from-[#FF0050]" }
    if (mod === 1) return { head: "bg-[#00F2EA] shadow-[0_0_6px_#00F2EA]", tail: "from-[#00F2EA]" }
    return { head: "bg-white shadow-[0_0_4px_#ffffff80]", tail: "from-white" }
  }

  return (
    <>
      {meteorStyles.map((style, idx) => {
        const { head, tail } = getColors(idx)
        return (
          <span
            key={idx}
            style={{ ...style } as React.CSSProperties}
            className={cn(
              `animate-meteor pointer-events-none absolute size-[2px] rotate-[var(--angle)] rounded-full ${head}`,
              className
            )}
          >
            <div className={`pointer-events-none absolute top-1/2 -z-10 h-px w-[120px] -translate-y-1/2 bg-gradient-to-r ${tail} to-transparent opacity-80`} />
          </span>
        )
      })}
    </>
  )
}
