import { useState } from 'react'
import Cursor from './Cursor'

export default function Scene() {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <main className="h-full flex items-center justify-center">
      <h1
        onMouseEnter={() => {
          setIsHovered(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
        }}
        className="text-[4.5vw] max-w-[90vw] text-center text-white p-20 z-20"
      >
        The quick brown fox jumps over the lazy dog
      </h1>
      <Cursor isHovered={isHovered} />
    </main>
  )
}
