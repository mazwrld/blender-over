import gsap from 'gsap'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { linearInterpolation } from '../../utils/linearInterpolation'

export default function Cursor({ isHovered }: { isHovered: boolean }) {
  const colors = useMemo(() => ['#c32d27', '#f5c63f', '#457ec4', '#6638f0'], [])
  const size = isHovered ? 400 : 40
  const mouse = useRef({ x: 0, y: 0 })
  const delayedMouse = useRef({ x: 0, y: 0 })
  const circles = useRef<(HTMLDivElement | null)[]>([])

  const manageMouseMove = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event
    mouse.current = { x: clientX, y: clientY }
  }, [])

  function moveCircles(x: number, y: number) {
    circles.current.forEach((circle) => {
      if (circle) {
        gsap.set(circle, {
          x,
          y,
          xPercent: -50,
          yPercent: -50,
        })
      }
    })
  }

  const animate = useCallback(() => {
    const { x, y } = delayedMouse.current
    delayedMouse.current = {
      x: linearInterpolation(x, mouse.current.x, 0.075),
      y: linearInterpolation(y, mouse.current.y, 0.075),
    }
    moveCircles(delayedMouse.current.x, delayedMouse.current.y)
    window.requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    animate()
    window.addEventListener('mousemove', manageMouseMove)
    return () => window.removeEventListener('mousemove', manageMouseMove)
  }, [animate, manageMouseMove])

  return (
    <>
      {colors.map((color, index, array) => {
        return (
          <div
            key={index}
            ref={(ref) => (circles.current[index] = ref)}
            className="fixed top-0 left-0 rounded-full mix-blend-difference pointer-events-none"
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              filter: isHovered ? 'blur(30px)' : 'blur(2px)',
              transition: `height 0.3s ease-out, width 0.3s ease-out, filter 0.3s ease-out, transform ${
                (array.length - index) * 0.095
              }s ease-out`,
            }}
          />
        )
      })}
    </>
  )
}
