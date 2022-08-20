"use strict"
//-------------------------------------------
// Helper Function
// ------------------------------------------
function setAttr(selector, attrName, value) {
  return selector.setAttribute(attrName, value)
}

function calcPointerXForShow(getOffsetX, svgSize, dividedNum) {
  const calculatePointerX = ((getOffsetX / dividedNum) / (svgSize / dividedNum))
  const pointerXCoordinate = calculatePointerX.toFixed(2)

  if (Number(pointerXCoordinate) <= 0) return 0
  if (Number(pointerXCoordinate) >= 1) return 1
  if (Number(pointerXCoordinate) < 0 || Number(pointerXCoordinate) > 1) return Number(pointerXCoordinate)

  return String(parseFloat(pointerXCoordinate)).slice(1)
}

function calculatePointerXYCoordinate(eventDetails, svgSizeHeight, svgSizeWidth, cubicBezierSvgPosition) {
  const pointerXYcoordinateTmp = {
    x: eventDetails.offsetX,
    y: eventDetails.offsetY
  }

  if (eventDetails.clientY > cubicBezierSvgPosition.bottom) {
    const calculateOffsetX = eventDetails.clientX - Math.round(cubicBezierSvgPosition.left)
    const calculateOffsetY = eventDetails.clientY - Math.round(cubicBezierSvgPosition.bottom)
    pointerXYcoordinateTmp.x = calculateOffsetX
    pointerXYcoordinateTmp.y = calculateOffsetY + svgSizeHeight
  }
  if (eventDetails.clientY < cubicBezierSvgPosition.top) {
    const calculateOffsetX = eventDetails.clientX - Math.round(cubicBezierSvgPosition.left)
    const calculateOffsetY = Math.round(cubicBezierSvgPosition.top) - eventDetails.clientY
    pointerXYcoordinateTmp.x = calculateOffsetX
    pointerXYcoordinateTmp.y = -calculateOffsetY
  }
  if (eventDetails.clientX > cubicBezierSvgPosition.right) {
    const calculateOffsetY = eventDetails.clientY - Math.round(cubicBezierSvgPosition.top)
    pointerXYcoordinateTmp.x = svgSizeWidth
    pointerXYcoordinateTmp.y = calculateOffsetY
  }
  if (eventDetails.clientX < cubicBezierSvgPosition.left) {
    const calculateOffsetY = eventDetails.clientY - Math.round(cubicBezierSvgPosition.top)
    pointerXYcoordinateTmp.x = 0
    pointerXYcoordinateTmp.y = calculateOffsetY
  }

  return pointerXYcoordinateTmp
}

function calcPointerYForShow(getOffsetY, svgSize, dividedNum) {
  let calculatePointerY = 1 - (((getOffsetY / dividedNum) / (svgSize / dividedNum)))
  const pointerYCoordinate = calculatePointerY.toFixed(2)

  if (Number(pointerYCoordinate) === 0) return 0
  if (Number(pointerYCoordinate) === 1) return 1
  if (Number(pointerYCoordinate) < 0 || Number(pointerYCoordinate) > 1) return Number(pointerYCoordinate)

  return String(parseFloat(pointerYCoordinate)).slice(1)
}

function showCubicXYNumber(selectedPointer, showPointerXY) {
  const getPointerXForShow = calcPointerXForShow(selectedPointer.x, svgWidth, dividedByNum)
  const getPointerYForShow = calcPointerYForShow(selectedPointer.y, svgHeight, dividedByNum)
  showPointerXY.innerText = `${getPointerXForShow}, ${getPointerYForShow}`
}

function drawCurve(pointerXY, circlePointerSelector, pointerLineSelector, cubicBezierCurveSelector, cubicBezierCurveData, selectedShowPointerXY) {
  setAttr(circlePointerSelector, 'cx', pointerXY.x)
  setAttr(circlePointerSelector, 'cy', pointerXY.y)
  setAttr(pointerLineSelector, 'x2', pointerXY.x)
  setAttr(pointerLineSelector, 'y2', pointerXY.y)
  setAttr(cubicBezierCurveSelector, 'd', cubicBezierCurveData)

  showCubicXYNumber(pointerXY, selectedShowPointerXY)
}

//-------------------------------------------
// Initialize
// ------------------------------------------
const pointerXY1 = {
  x: 100,
  y: 100,
}
const pointerXY2 = {
  x: 150,
  y: 120,
}
const svgWidth = 200
const svgHeight = 200
const dividedByNum = 2 //1st char of svg size. ex: 250->2.5, 400->4 
let currentSelectedPointer = ''
const svgCubicBezier = document.getElementById('svgCubicBezierContainer')
const svgMarkup = `
  <div style="width: 200px; text-align: start;">
    <style type="text/css">
      .visualizeBezier {
        background-color:red;
        margin-top:20px;
        width:40px;
        height:40px;
        display: inline-block;
        animation-name: anim;
        animation-duration: 2s;
        animation-iteration-count: infinite;
      }
      @keyframes anim {
          to { transform: translateX(200px); }
      } 
    </style>
    <span class="visualizeBezier" id="visualizeBezier" style="animation-timing-function: cubic-bezier(.1, -2, 1.0, 2);"></span>
  </div>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" style="border: 1px solid #e4e4e4;touch-action: none;overflow: visible; z-index: 2;">
      <line id="pointerLine1" x1="0" y1="${svgHeight}" x2="${pointerXY1.x}" y2="${pointerXY1.y}" stroke-width="2px" stroke="#dedede" stroke-linecap="round"/>
      <line id="pointerLine2" x1="${svgWidth}" y1="0" x2="${pointerXY2.x}" y2="${pointerXY2.y}" stroke-width="2px" stroke="#dedede" stroke-linecap="round"/>

      <path id="cubicBezierCurve" d="M0 ${svgHeight} C${pointerXY1.x} ${pointerXY1.y} ${pointerXY2.x} ${pointerXY2.y} ${svgWidth} 0" stroke-width="6" stroke="#000" stroke-linecap="round" fill="none" />

      <circle id="pointerUpRight" cx="${svgWidth}" cy="0" r="8" stroke="#bbbbbb" stroke-width="1" fill="#fff" />
      <circle id="pointerDownLeft" cx="0" cy="${svgHeight}" r="8" stroke="#bbbbbb" stroke-width="1" fill="#fff"/>

      <circle id="circlePointer1" cx="${pointerXY1.x}" cy="${pointerXY1.y}" r="10" fill="#8f57f4" />
      <circle id="circlePointer2" cx="${pointerXY2.x}" cy="${pointerXY2.y}" r="10" fill="#ff4c89" />
    </svg>
    <div style="width:200px">
      <strong>
        <h2 style="font-size: 16px; margin:0px;">
          cubic-bezier(
          <span id="showPointerXY1" style="color:#4a5fd3; letter-spacing:1px;"></span>, 
          <span id="showPointerXY2" style="color:#f21f67;letter-spacing:1px;"></span>
          )
        </h2>
      </strong>
    </div>
  `
svgCubicBezier.innerHTML = svgMarkup
const cubicBezierCurve = document.getElementById('cubicBezierCurve')
const circlePointer1 = document.getElementById('circlePointer1')
const circlePointer2 = document.getElementById('circlePointer2')
const pointerLine1 = document.getElementById('pointerLine1')
const pointerLine2 = document.getElementById('pointerLine2')
const showPointerXY1 = document.getElementById('showPointerXY1')
const showPointerXY2 = document.getElementById('showPointerXY2')
const visualizeBezier = document.getElementById('visualizeBezier')
const cubicBezierSvgPosition = cubicBezierCurve.getBoundingClientRect()

showCubicXYNumber(pointerXY1, showPointerXY1)
showCubicXYNumber(pointerXY2, showPointerXY2)

const getPointer1XForShow = calcPointerXForShow(pointerXY1.x, svgWidth, dividedByNum)
const getPointer1YForShow = calcPointerYForShow(pointerXY1.y, svgHeight, dividedByNum)

const getPointer2XForShow = calcPointerXForShow(pointerXY2.x, svgWidth, dividedByNum)
const getPointer2YForShow = calcPointerYForShow(pointerXY2.y, svgHeight, dividedByNum)

visualizeBezier.style.animationTimingFunction = `cubic-bezier(${getPointer1XForShow}, ${getPointer1YForShow}, ${getPointer2XForShow}, ${getPointer2YForShow})`

//-------------------------------------------
// Code start from here
// ------------------------------------------
function pointerMove(e) {

  let cubicBezierCurveData = `M0 ${svgHeight} C${pointerXY1.x} ${pointerXY1.y} ${pointerXY2.x} ${pointerXY2.y} ${svgWidth} 0`

  const calcPointerXYCoordinate = calculatePointerXYCoordinate(e, svgHeight, svgWidth, cubicBezierSvgPosition)
  if (currentSelectedPointer === 'pointer1') {
    pointerXY1.x = calcPointerXYCoordinate.x
    pointerXY1.y = calcPointerXYCoordinate.y
    const getPointer1XForShow = calcPointerXForShow(calcPointerXYCoordinate.x, svgWidth, dividedByNum)
    const getPointer1YForShow = calcPointerYForShow(calcPointerXYCoordinate.y, svgHeight, dividedByNum)

    const getPointer2XForShow = calcPointerXForShow(pointerXY2.x, svgWidth, dividedByNum)
    const getPointer2YForShow = calcPointerYForShow(pointerXY2.y, svgHeight, dividedByNum)
    visualizeBezier.style.animationTimingFunction = `cubic-bezier(${getPointer1XForShow}, ${getPointer1YForShow}, ${getPointer2XForShow}, ${getPointer2YForShow})`

    cubicBezierCurveData = `M0 ${svgHeight} C${pointerXY1.x} ${pointerXY1.y} ${pointerXY2.x} ${pointerXY2.y} ${svgWidth} 0`
    drawCurve(pointerXY1, circlePointer1, pointerLine1, cubicBezierCurve, cubicBezierCurveData, showPointerXY1)
  }

  if (currentSelectedPointer === 'pointer2') {
    pointerXY2.x = calcPointerXYCoordinate.x
    pointerXY2.y = calcPointerXYCoordinate.y

    cubicBezierCurveData = `M0 ${svgHeight} C${pointerXY1.x} ${pointerXY1.y} ${pointerXY2.x} ${pointerXY2.y} ${svgWidth} 0`

    const getPointer1XForShow = calcPointerXForShow(pointerXY1.x, svgWidth, dividedByNum)
    const getPointer1YForShow = calcPointerYForShow(pointerXY1.y, svgHeight, dividedByNum)

    const getPointer2XForShow = calcPointerXForShow(calcPointerXYCoordinate.x, svgWidth, dividedByNum)
    const getPointer2YForShow = calcPointerYForShow(calcPointerXYCoordinate.y, svgHeight, dividedByNum)

    visualizeBezier.style.animationTimingFunction = `cubic-bezier(${getPointer1XForShow}, ${getPointer1YForShow}, ${getPointer2XForShow}, ${getPointer2YForShow})`

    drawCurve(pointerXY2, circlePointer2, pointerLine2, cubicBezierCurve, cubicBezierCurveData, showPointerXY2)
  }
}
function pointerUp(e) {
  e.preventDefault()
  document.removeEventListener("mousemove", pointerMove)
  document.removeEventListener("mouseup", pointerUp)
}
const pointerDown = (selectedPointer) => () => {
  currentSelectedPointer = selectedPointer
  document.addEventListener("mousemove", pointerMove)
  document.addEventListener("mouseup", pointerUp)
}

circlePointer1.addEventListener("mousedown", pointerDown("pointer1"))
circlePointer2.addEventListener("mousedown", pointerDown("pointer2"))
