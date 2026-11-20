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

const CELL = 18
const FONT = '10px ui-monospace, "SF Mono", Menlo, Consolas, monospace'

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
    const ctx = canvas.getContext('2d')
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
        for (let x = 0; x < cols; x++) {
          bctx.fillText(
            glyphs[y * cols + x],
            x * CELL + CELL * 0.5,
            y * CELL + CELL * 0.5,
          )
        }
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
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

    const drawColumn = (
      x: number,
      color: string,
      now: number,
      pulse: boolean,
    ) => {
      if (x < 0 || x >= cols) return
      ctx.font = FONT
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = color
      const t = now * 0.001
      for (let y = 0; y < rows; y++) {
        if (pulse) {
          ctx.globalAlpha = 0.75 + 0.25 * Math.sin(t * 5.5 + y * 0.4)
        }
        ctx.fillText(
          glyphs[y * cols + x],
          x * CELL + CELL * 0.5,
          y * CELL + CELL * 0.5,
        )
      }
      ctx.globalAlpha = 1
    }

    const draw = (now: number) => {
      if (!base) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(base, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const t = now * 0.001
      if (!reduce.matches) {
        scanCol = Math.floor(((t * 2.2) % cols) + cols) % cols
      }

      const hot = pointerCol >= 0 ? pointerCol : scanCol
      drawColumn(hot - 2, 'rgba(201, 182, 176, 0.16)', now, false)
      drawColumn(hot - 1, 'rgba(196, 163, 90, 0.32)', now, false)
      drawColumn(hot, 'rgba(224, 197, 122, 0.72)', now, !reduce.matches)
      drawColumn(hot + 1, 'rgba(196, 163, 90, 0.32)', now, false)
      drawColumn(hot + 2, 'rgba(201, 182, 176, 0.16)', now, false)
    }

    const tick = (now: number) => {
      if (!running) return
      if (now - last > 48) {
        last = now
        draw(now)
      }
      if (!reduce.matches) frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      if (!fine.matches) return
      pointerCol = Math.floor(event.clientX / CELL)
    }

    const onLeave = () => {
      pointerCol = -1
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    if (!reduce.matches) frame = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas className="glyph-field" ref={canvasRef} aria-hidden="true" />
}
