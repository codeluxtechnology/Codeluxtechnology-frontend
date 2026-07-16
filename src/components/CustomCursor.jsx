import { useEffect, useRef, useState } from 'react'

const interactiveSelector = 'a, button, [role="button"], input, textarea, select, .service-pro-card, .team-card, #portfolio article, #jobs article, .dashboard-mini-card'
const textSelector = 'h1, h2, h3, h4, strong, p, li, span, input, textarea, [contenteditable="true"]'
const magneticSelector = '.home-button-primary, .home-button-light, #jobs a, .contact-section a[href^="tel"], .contact-section button[type="submit"], .contact-map-card a'

const getCursorLabel = (element) => {
  const link = element.closest?.('a')
  if (!link) return ''
  if (link.target === '_blank') return 'Open'
  if (link.closest('#portfolio')) return 'View'
  return ''
}

const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const stateRef = useRef({
    enabled: false,
    pointer: { x: 0, y: 0 },
    ring: { x: 0, y: 0 },
    label: '',
    raf: 0,
  })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const cursorState = stateRef.current
    let magneticTarget = null
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    const updateCapability = () => {
      const canUseCursor = finePointer.matches && !reduceMotion.matches
      cursorState.enabled = canUseCursor
      setEnabled(canUseCursor)
      document.body.classList.toggle('custom-cursor-enabled', canUseCursor)
    }

    updateCapability()
    reduceMotion.addEventListener('change', updateCapability)
    finePointer.addEventListener('change', updateCapability)

    const updateHoverState = (target) => {
      const interactive = target.closest?.(interactiveSelector)
      const text = target.closest?.(textSelector)
      const label = interactive ? getCursorLabel(interactive) : ''
      const glowTarget = text && !interactive ? text : null
      document.body.classList.toggle('cursor-is-interactive', Boolean(interactive))
      document.body.classList.toggle('cursor-is-text', Boolean(text) && !interactive)
      document.body.classList.toggle('cursor-has-label', Boolean(label))
      document.querySelectorAll('.cursor-text-glow').forEach((element) => {
        if (element !== glowTarget) element.classList.remove('cursor-text-glow')
      })
      glowTarget?.classList.add('cursor-text-glow')
      cursorState.label = label
      if (labelRef.current) labelRef.current.textContent = label
    }

    const moveMagneticTarget = (event, target) => {
      const rect = target.getBoundingClientRect()
      const pullX = (event.clientX - rect.left - rect.width / 2) * 0.16
      const pullY = (event.clientY - rect.top - rect.height / 2) * 0.16
      target.style.setProperty('--magnetic-x', `${pullX}px`)
      target.style.setProperty('--magnetic-y', `${pullY}px`)
    }

    const resetMagneticTarget = () => {
      if (!magneticTarget) return
      magneticTarget.style.removeProperty('--magnetic-x')
      magneticTarget.style.removeProperty('--magnetic-y')
      magneticTarget = null
    }

    const handlePointerMove = (event) => {
      if (!cursorState.enabled) return
      cursorState.pointer.x = event.clientX
      cursorState.pointer.y = event.clientY
      document.documentElement.style.setProperty('--lux-pointer-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--lux-pointer-y', `${event.clientY}px`)
      updateHoverState(event.target)

      const nextMagneticTarget = event.target.closest?.(magneticSelector)
      if (magneticTarget && magneticTarget !== nextMagneticTarget) resetMagneticTarget()
      magneticTarget = nextMagneticTarget
      if (magneticTarget) moveMagneticTarget(event, magneticTarget)
    }

    const handlePointerDown = () => document.body.classList.add('cursor-is-active')
    const handlePointerUp = () => document.body.classList.remove('cursor-is-active')
    const handlePointerLeave = () => {
      document.body.classList.add('cursor-is-hidden')
      document.querySelectorAll('.cursor-text-glow').forEach((element) => element.classList.remove('cursor-text-glow'))
      resetMagneticTarget()
    }
    const handlePointerEnter = () => document.body.classList.remove('cursor-is-hidden')

    const animate = () => {
      const state = cursorState
      if (state.enabled && dotRef.current && ringRef.current) {
        state.ring.x += (state.pointer.x - state.ring.x) * 0.18
        state.ring.y += (state.pointer.y - state.ring.y) * 0.18
        dotRef.current.style.transform = `translate3d(${state.pointer.x}px, ${state.pointer.y}px, 0) translate(-50%, -50%)`
        ringRef.current.style.transform = `translate3d(${state.ring.x}px, ${state.ring.y}px, 0) translate(-50%, -50%)`
        if (labelRef.current) {
          labelRef.current.style.transform = `translate3d(${state.ring.x + 22}px, ${state.ring.y - 18}px, 0)`
        }
      }
      state.raf = window.requestAnimationFrame(animate)
    }

    cursorState.raf = window.requestAnimationFrame(animate)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('pointerenter', handlePointerEnter, { passive: true })

    return () => {
      window.cancelAnimationFrame(cursorState.raf)
      reduceMotion.removeEventListener('change', updateCapability)
      finePointer.removeEventListener('change', updateCapability)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('pointerenter', handlePointerEnter)
      resetMagneticTarget()
      document.querySelectorAll('.cursor-text-glow').forEach((element) => element.classList.remove('cursor-text-glow'))
      document.body.classList.remove('custom-cursor-enabled', 'cursor-is-interactive', 'cursor-is-text', 'cursor-is-active', 'cursor-is-hidden', 'cursor-has-label')
    }
  }, [])

  if (!enabled) return null

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor-dot" ref={dotRef}></span>
      <span className="custom-cursor-ring" ref={ringRef}></span>
      <span className="custom-cursor-label" ref={labelRef}></span>
    </div>
  )
}

export default CustomCursor
