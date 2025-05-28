const sensitivity = 0.0005
const sun = document.querySelector(".sun")
const ground = document.querySelector(".ground")
const sky = document.querySelector('.sky')
const groundHeight = 30
const xPadding = 20
const yPadding = 10

const sunSunset = { r: 255, g: 165, b: 0 }
const sunDay    = { r: 255, g: 236, b: 139 }

const sunsetBottom = { r: 255, g: 94,  b: 19 }
const sunsetTop    = { r: 106, g: 130, b: 251 }
const dayBottom    = { r: 135, g: 206, b: 235 }
const dayTop       = { r: 255, g: 255, b: 255 }

function lerp(start, end, t) {
    return start + (end - start) * t
}

function lerpColor(c1, c2, t) {
    return {
        r: Math.round(lerp(c1.r, c2.r, t)),
        g: Math.round(lerp(c1.g, c2.g, t)),
        b: Math.round(lerp(c1.b, c2.b, t))
    }
}

function colorToRgb(c) {
    return `rgb(${c.r},${c.g},${c.b})`
}

let targetXPos = 0
let currentXPos = 0

ground.style.top = `${100 - groundHeight}%`
ground.style.height = `${groundHeight}%`
sun.style.left = `${xPadding}%`
sun.style.top = `${100 - groundHeight}%`
sun.style.background = colorToRgb(sunSunset)
sun.style.boxShadow = `0 0 80px 40px rgba(${sunSunset.r},${sunSunset.g},${sunSunset.b},0.6)`
sky.style.background = `linear-gradient(to top, ${colorToRgb(sunsetBottom)} 0%, ${colorToRgb(sunsetTop)} 100%)`

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function animate() {
    currentXPos = lerp(currentXPos, targetXPos, 0.02)

    let yPos = Math.sin(currentXPos * Math.PI)
    let xOffset = (100 - xPadding * 2) * currentXPos
    let yOffset = (50 - yPadding) * yPos

    sun.style.left = `${xPadding + xOffset}%`
    sun.style.top = `${100 - groundHeight - yOffset}%`

    let t = currentXPos * 2
    let sunColor, skyT, bottomColor, topColor
    if (t <= 1) {
        sunColor = lerpColor(sunSunset, sunDay, t)
        skyT = t
        bottomColor = lerpColor(sunsetBottom, dayBottom, skyT)
        topColor = lerpColor(sunsetTop, dayTop, skyT)
    } else {
        sunColor = lerpColor(sunDay, sunSunset, t - 1)
        skyT = t - 1
        bottomColor = lerpColor(dayBottom, sunsetBottom, skyT)
        topColor = lerpColor(dayTop, sunsetTop, skyT)
    }
    sun.style.background = colorToRgb(sunColor)
    sun.style.boxShadow = `0 0 80px 40px rgba(${sunColor.r},${sunColor.g},${sunColor.b},0.6)`

    sky.style.background = `linear-gradient(to top, ${colorToRgb(bottomColor)} 0%, ${colorToRgb(topColor)} 100%)`

    if (Math.abs(targetXPos - currentXPos) > 0.001) {
        requestAnimationFrame(animate)
    } else {
        currentXPos = targetXPos
    }
}

window.addEventListener("wheel", e => {
    e.preventDefault()
    targetXPos += e.deltaY * sensitivity
    targetXPos = clamp(targetXPos, 0, 1)
    requestAnimationFrame(animate)
}, { passive: false })
