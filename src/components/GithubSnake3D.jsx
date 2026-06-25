import React, { useEffect, useRef, useState } from 'react'

export default function GithubSnake3D({ weeks, containerRef }) {
  const canvasRef = useRef(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (!weeks || weeks.length === 0 || !containerRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1. Grid parameters
    const numCols = weeks.length
    const numRows = 7

    // 2. Map day data in 1D array corresponding to grid order (column-major)
    // The calendar cells are rendered week-by-week, day-by-day.
    const cellsData = []
    weeks.forEach((week, colIdx) => {
      // Ensure all 7 days of the week are mapped (some weeks might have fewer elements, pad them)
      for (let rowIdx = 0; rowIdx < 7; rowIdx++) {
        const day = week.contributionDays.find(d => d.weekday === rowIdx)
        cellsData.push({
          col: colIdx,
          row: rowIdx,
          count: day ? day.contributionCount : 0,
          color: day ? day.color : '#ebedf0',
          eaten: false,
          domElement: null
        })
      }
    })

    // 3. Grid representation helper
    const getCell = (col, row) => {
      if (col < 0 || col >= numCols || row < 0 || row >= numRows) return null
      return cellsData[col * 7 + row]
    }

    // 4. Snake State
    // Start at a random empty cell near the top left
    let snakeSegments = [
      { col: 0, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: 2 }
    ]
    let snakeLength = 3
    let currentGridPos = { ...snakeSegments[0] }
    let targetGridPos = { ...snakeSegments[0] }
    let moveProgress = 1.0 // 1.0 means sitting at currentGridPos, awaiting new target
    let moveSpeed = 0.08 // speed of linear interpolation (progress increment per frame)
    let searchCooldown = 0
    let path = []

    // 5. Particles state
    let particles = []

    // 6. Cell positions in canvas space
    let cellPositions = [] // array of { col, row, x, y, size }

    const updateCellPositions = () => {
      if (!containerRef.current || !canvas) return
      
      const containerRect = containerRef.current.getBoundingClientRect()
      canvas.width = containerRect.width
      canvas.height = containerRect.height

      const children = Array.from(containerRef.current.children)
      
      cellPositions = []
      cellsData.forEach((cell, idx) => {
        const el = children[idx]
        if (el) {
          cell.domElement = el
          const rect = el.getBoundingClientRect()
          const x = rect.left - containerRect.left + rect.width / 2
          const y = rect.top - containerRect.top + rect.height / 2
          cellPositions.push({
            col: cell.col,
            row: cell.row,
            x,
            y,
            size: rect.width
          })
        }
      })
    }

    updateCellPositions()

    // Listen to resize to recalculate cells coordinates
    const resizeObserver = new ResizeObserver(() => {
      updateCellPositions()
    })
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // 7. BFS Pathfinder to find nearest uneaten contribution cell
    const findPathToFood = (startCol, startRow) => {
      const queue = [{ col: startCol, row: startRow, path: [] }]
      const visited = new Set()
      visited.add(`${startCol},${startRow}`)

      const directions = [
        { dCol: 0, dRow: -1 }, // Up
        { dCol: 0, dRow: 1 },  // Down
        { dCol: -1, dRow: 0 }, // Left
        { dCol: 1, dRow: 0 }   // Right
      ]

      while (queue.length > 0) {
        const curr = queue.shift()
        const cell = getCell(curr.col, curr.row)

        if (cell && cell.count > 0 && !cell.eaten) {
          // Found food!
          return curr.path
        }

        // Shuffle directions to create organic variations
        const shuffledDirs = [...directions].sort(() => Math.random() - 0.5)

        for (const dir of shuffledDirs) {
          const nextCol = curr.col + dir.dCol
          const nextRow = curr.row + dir.dRow
          const key = `${nextCol},${nextRow}`

          if (
            nextCol >= 0 && nextCol < numCols &&
            nextRow >= 0 && nextRow < numRows &&
            !visited.has(key)
          ) {
            // Avoid running into own body (except tail which moves out of the way)
            const isBody = snakeSegments.slice(0, -1).some(seg => seg.col === nextCol && seg.row === nextRow)
            if (!isBody) {
              visited.add(key)
              queue.push({
                col: nextCol,
                row: nextRow,
                path: [...curr.path, { col: nextCol, row: nextRow }]
              })
            }
          }
        }
      }

      return null // No food found
    }

    // 8. Wander behavior if no contributions left
    const getWanderTarget = (startCol, startRow) => {
      const directions = [
        { dCol: 0, dRow: -1 },
        { dCol: 0, dRow: 1 },
        { dCol: -1, dRow: 0 },
        { dCol: 1, dRow: 0 }
      ]
      
      const shuffledDirs = [...directions].sort(() => Math.random() - 0.5)
      for (const dir of shuffledDirs) {
        const nextCol = startCol + dir.dCol
        const nextRow = startRow + dir.dRow
        
        if (nextCol >= 0 && nextCol < numCols && nextRow >= 0 && nextRow < numRows) {
          const isBody = snakeSegments.slice(0, -1).some(seg => seg.col === nextCol && seg.row === nextRow)
          if (!isBody) {
            return { col: nextCol, row: nextRow }
          }
        }
      }
      return null
    }

    // 9. Particle Explosion Generator
    const createExplosion = (x, y, colorCode) => {
      const count = 12
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 2.0
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5, // drift slightly upward
          color: colorCode,
          size: 2 + Math.random() * 3,
          alpha: 1.0,
          decay: 0.02 + Math.random() * 0.03
        })
      }
    }

    // 10. Core Loop Variables
    let animationFrameId

    const getInterpolatedScreenPos = (pos1, pos2, p) => {
      const screen1 = cellPositions.find(pos => pos.col === pos1.col && pos.row === pos1.row)
      const screen2 = cellPositions.find(pos => pos.col === pos2.col && pos.row === pos2.row)
      
      if (!screen1) return { x: 0, y: 0, size: 10 }
      if (!screen2) return screen1

      return {
        x: screen1.x + (screen2.x - screen1.x) * p,
        y: screen1.y + (screen2.y - screen1.y) * p,
        size: screen1.size + (screen2.size - screen1.size) * p
      }
    }

    // Reset contribution flags when all are eaten
    const resetContributionsIfNecessary = () => {
      const remainingFood = cellsData.some(c => c.count > 0 && !c.eaten)
      if (!remainingFood) {
        cellsData.forEach(c => {
          c.eaten = false
          if (c.domElement) {
            c.domElement.style.opacity = '1'
            c.domElement.style.transform = 'scale(1)'
            c.domElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
          }
        })
      }
    }

    // 11. Frame updates
    const update = () => {
      // Handle movement progress
      if (moveProgress < 1.0) {
        moveProgress += moveSpeed
        if (moveProgress >= 1.0) {
          moveProgress = 1.0
          
          // Arrived at target. Update snake body segments
          currentGridPos = { ...targetGridPos }
          
          const cell = getCell(currentGridPos.col, currentGridPos.row)
          let eatenFood = false

          if (cell && cell.count > 0 && !cell.eaten) {
            cell.eaten = true
            eatenFood = true
            
            // Fade out cell element dynamically
            if (cell.domElement) {
              cell.domElement.style.opacity = '0.15'
              cell.domElement.style.transform = 'scale(0.85)'
              cell.domElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
            }

            // Explode particles
            const screen = cellPositions.find(pos => pos.col === currentGridPos.col && pos.row === currentGridPos.row)
            if (screen) {
              createExplosion(screen.x, screen.y, cell.color)
            }

            // Grow snake
            snakeLength += 1
          }

          // Shift segments array
          snakeSegments.unshift({ ...currentGridPos })
          while (snakeSegments.length > snakeLength) {
            snakeSegments.pop()
          }

          resetContributionsIfNecessary()
        }
      }

      // If sitting at a cell, choose next move
      if (moveProgress >= 1.0) {
        // Cooldown between movements
        if (searchCooldown > 0) {
          searchCooldown--
        } else {
          // Re-evaluate path to food
          path = findPathToFood(currentGridPos.col, currentGridPos.row)
          
          let nextStep = null
          if (path && path.length > 0) {
            nextStep = path[0]
          } else {
            // No food path, wander randomly
            nextStep = getWanderTarget(currentGridPos.col, currentGridPos.row)
          }

          if (nextStep) {
            targetGridPos = nextStep
            moveProgress = 0.0
            searchCooldown = 1 // frames gap
          }
        }
      }

      // Update particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay
      })
      particles = particles.filter(p => p.alpha > 0)
    }

    // 12. Render drawing
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // A. Draw particles
      particles.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // B. Draw snake body
      if (cellPositions.length === 0) return

      // Calculate interpolated positions for all segments
      const segmentCoords = []
      
      // Head position is interpolated between current and target
      const headCoords = getInterpolatedScreenPos(currentGridPos, targetGridPos, moveProgress)
      segmentCoords.push(headCoords)

      // Remaining segments trail behind
      for (let i = 1; i < snakeSegments.length; i++) {
        // Interpolate body parts to follow head smoothly
        const prevSeg = snakeSegments[i - 1]
        const currSeg = snakeSegments[i]
        
        // Segments follow the one in front of them
        // Progress of following segments matches head's movement progress
        const coords = getInterpolatedScreenPos(currSeg, prevSeg, moveProgress)
        segmentCoords.push(coords)
      }

      // Draw shadow for whole snake first to make it cohesive
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetY = 4.5
      ctx.shadowOffsetX = 1.5

      // Draw glossy 3D spheres for each body segment
      segmentCoords.forEach((coords, idx) => {
        const isHead = idx === 0
        // Taper segments
        const baseRadius = coords.size / 2.2
        const r = isHead ? baseRadius * 1.1 : baseRadius * (1.0 - (idx / snakeSegments.length) * 0.4)

        if (r <= 0) return

        ctx.beginPath()
        ctx.arc(coords.x, coords.y, r, 0, Math.PI * 2)

        // Radial gradient for 3D glossy sphere look
        // The inner circle (specular light source highlight) is offset to the top-left
        const grad = ctx.createRadialGradient(
          coords.x - r * 0.35, coords.y - r * 0.35, r * 0.05,
          coords.x, coords.y, r
        )
        
        // Colors mapping:
        // Glossy dark/neon styling
        if (isHead) {
          grad.addColorStop(0, '#f8fafc') // glossy white shine
          grad.addColorStop(0.25, '#818cf8') // Indigo midtone
          grad.addColorStop(1, '#312e81') // Deep indigo base
        } else {
          grad.addColorStop(0, '#bef264') // lime light shine
          grad.addColorStop(0.3, '#22c55e') // green midtone
          grad.addColorStop(1, '#14532d') // Dark green base
        }

        ctx.fillStyle = grad
        ctx.fill()
      })
      ctx.restore()

      // C. Draw glowing eyes on head segment (pointing in moving direction)
      if (segmentCoords.length > 0) {
        const head = segmentCoords[0]
        const r = head.size / 2.2 * 1.1

        // Determine movement direction vector
        let dx = targetGridPos.col - currentGridPos.col
        let dy = targetGridPos.row - currentGridPos.row

        // Normalize
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len > 0) {
          dx /= len
          dy /= len
        } else {
          // Default eyes pointing down
          dx = 0
          dy = 1
        }

        // Perpendicular vector for eyes offset (left & right)
        const px = -dy
        const py = dx

        // Calculate positions for two eyes
        const eyeOffsetDist = r * 0.4
        const eyeForwardDist = r * 0.45
        const eyeRadius = r * 0.16

        const leftEyeX = head.x + dx * eyeForwardDist + px * eyeOffsetDist
        const leftEyeY = head.y + dy * eyeForwardDist + py * eyeOffsetDist

        const rightEyeX = head.x + dx * eyeForwardDist - px * eyeOffsetDist
        const rightEyeY = head.y + dy * eyeForwardDist - py * eyeOffsetDist

        // Draw left eye
        ctx.beginPath()
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#60a5fa'
        ctx.shadowBlur = 4
        ctx.fill()

        // Draw right eye
        ctx.beginPath()
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = 4
        ctx.fill()
      }
    }

    const tick = () => {
      update()
      draw()
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      // Restore elements state when component unmounts
      cellsData.forEach(c => {
        if (c.domElement) {
          c.domElement.style.opacity = '1'
          c.domElement.style.transform = 'scale(1)'
        }
      })
    }
  }, [weeks, containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
