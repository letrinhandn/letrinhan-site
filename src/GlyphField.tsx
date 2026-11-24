import { useEffect, useRef } from 'react'

const GLYPHS = [
  '$',
  '#',
  '*',
  '+',
  '/',
  'X',
  '0',
  '1',
  '=',
  '<',
  '>',
  '{',
  '}',
  '|',
  '·',
  '%',
  '&',
  '^',
]

/** Larger cells = fewer fillText calls (main cost). */
const CELL = 28
const FONT = '11px ui-monospace, "SF Mono", Menlo, Consolas, monospace'
/** ~12 fps — enough for the scan bar, cheap on battery/CPU */
const FRAME_MS = 80

function fillGrid(cols: number, rows: number, seed: number): string[] {
  const cells: string[] = new Array(cols * rows)
  let s = seed >>> 0
  for (let i = 0; i < cells.length; i++) {
    s = (s * 1664525 + 1013904223) >>> 0
    cells[i] = GLYPHS[s % GLYPHS.length]
  }
  return cells
}

export function GlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')

    let width = 0
    let height = 0
    let dpr = 1
    let cols = 0
    let rows = 0
    let glyphs: string[] = []
    let base: HTMLCanvasElement | null = null
    let frame = 0
    let scanCol = 0
    let pointerCol = -1
    let last = 0
    let running = true
    let visible = document.visibilityState === 'visible'

    const paintBase = () => {
      if (!base) return
      const bctx = base.getContext('2d')
      if (!bctx) return
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.clearRect(0, 0, width, height)
      bctx.font = FONT
      bctx.textAlign = 'center'
      bctx.textBaseline = 'middle'
      bctx.fillStyle = 'rgba(201, 182, 176, 0.09)'
      for (let y = 0; y < rows; y++) {
        const yy = y * CELL + CELL * 0.5
        const row = y * cols
        for (let x = 0; x < cols; x++) {
          bctx.fillText(glyphs[row + x], x * CELL + CELL * 0.5, yy)
        }
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      width = document.documentElement.clientWidth || window.innerWidth
      height = document.documentElement.clientHeight || window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = ''
      canvas.style.height = ''
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(width / CELL) + 1
      rows = Math.ceil(height / CELL) + 1
      glyphs = fillGrid(cols, rows, (cols * 9973 + rows * 7919) >>> 0)
      scanCol = Math.floor(cols * 0.35)

      base = document.createElement('canvas')
      base.width = canvas.width
      base.height = canvas.height
      paintBase()
      draw(performance.now())
    }

    const drawColumn = (x: number, color: string) => {
      if (x < 0 || x >= cols) return
      ctx.fillStyle = color
      const xx = x * CELL + CELL * 0.5
      for (let y = 0; y < rows; y++) {
        ctx.fillText(glyphs[y * cols + x], xx, y * CELL + CELL * 0.5)
      }
    }

    const draw = (now: number) => {
      if (!base) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(base, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.font = FONT
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (!reduce.matches) {
        scanCol = Math.floor(((now * 0.0022) % cols) + cols) % cols
      }

      const hot = pointerCol >= 0 ? pointerCol : scanCol
      drawColumn(hot - 2, 'rgba(201, 182, 176, 0.16)')
      drawColumn(hot - 1, 'rgba(196, 163, 90, 0.32)')
      drawColumn(hot, 'rgba(224, 197, 122, 0.72)')
      drawColumn(hot + 1, 'rgba(196, 163, 90, 0.32)')
      drawColumn(hot + 2, 'rgba(201, 182, 176, 0.16)')
    }

    const tick = (now: number) => {
      if (!running) return
      if (visible && !reduce.matches && now - last >= FRAME_MS) {
        last = now
        draw(now)
      }
      if (!reduce.matches) frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || !visible) return
      pointerCol = Math.floor(event.clientX / CELL)
    }

    const onLeave = () => {
      pointerCol = -1
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible && !reduce.matches && !frame) {
        last = 0
        frame = requestAnimationFrame(tick)
      }
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 120)
    }

    resize()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    if (!reduce.matches) frame = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas className="glyph-field" ref={canvasRef} aria-hidden="true" />
}
