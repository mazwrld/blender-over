import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { linearInterpolation } from '../../utils/linearInterpolation'

const colors = ['#c32d27', '#f5c63f', '#457ec4', '#6638f0']

export default function Cursor({ isHovered }: { isHovered: boolean }) {
  const size = isHovered ? 400 : 40
  const mouse = useRef({ x: 0, y: 0 })
  const delayedMouse = useRef({ x: 0, y: 0 })
  const circles = useRef<(HTMLDivElement | null)[]>([])

  function manageMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event
    mouse.current = { x: clientX, y: clientY }
  }

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

  function animate() {
    const { x, y } = delayedMouse.current
    delayedMouse.current = {
      x: linearInterpolation(x, mouse.current.x, 0.075),
      y: linearInterpolation(y, mouse.current.y, 0.075),
    }
    moveCircles(delayedMouse.current.x, delayedMouse.current.y)
    window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    animate()
    window.addEventListener('mousemove', manageMouseMove)
    return () => window.removeEventListener('mousemove', manageMouseMove)
  }, [])

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
              filter: isHovered ? 'blur(30px)' : '2px',
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
