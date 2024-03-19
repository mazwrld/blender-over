import gsap from 'gsap'
import { useEffect, useRef } from 'react'

export default function Cursor({ isHovered }: { isHovered: boolean }) {
  const size = isHovered ? 400 : 40
  const mouse = useRef({ x: 0, y: 0 })
  const delayedMouse = useRef({ x: 0, y: 0 })
  const circle = useRef<HTMLDivElement | null>(null)

  function manageMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event
    mouse.current = { x: clientX, y: clientY }
  }

  const linearInterpolation = (
    initialValue: number,
    target: number,
    amount: number
  ) => initialValue * (1 - amount) + target * amount

  function moveCircle(x: number, y: number) {
    if (circle.current) {
      gsap.set(circle.current, { x, y, xPercent: -50, yPercent: -50 })
    }
  }

  function animate() {
    const { x, y } = delayedMouse.current

    delayedMouse.current = {
      x: linearInterpolation(x, mouse.current.x, 0.075),
      y: linearInterpolation(y, mouse.current.y, 0.075),
    }

    moveCircle(delayedMouse.current.x, delayedMouse.current.y)
    window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    animate()
    window.addEventListener('mousemove', manageMouseMove)
    return () => window.removeEventListener('mousemove', manageMouseMove)
  }, [])

  return (
    <div
      ref={circle}
      className="fixed top-0 left-0 bg-[#BCE4F2] rounded-full mix-blend-difference pointer-events-none"
      style={{
        width: size,
        height: size,
        filter: isHovered ? 'blur(30px)' : 'none',
        transition:
          'height 0.3s ease-out, width 0.3s ease-out, filter 0.3s ease-out',
      }}
    />
  )
}
