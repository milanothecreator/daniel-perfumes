import { useEffect, useRef } from 'react'

const VS_SOURCE = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`

const FS_SOURCE = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;

  const float overallSpeed = 0.2;
  const float gridSmoothWidth = 0.015;
  const float axisWidth = 0.05;
  const float majorLineWidth = 0.025;
  const float minorLineWidth = 0.0125;
  const float majorLineFrequency = 5.0;
  const float minorLineFrequency = 1.0;
  const float scale = 5.0;
  const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
  const float minLineWidth = 0.01;
  const float maxLineWidth = 0.2;
  const float lineSpeed = 1.0 * overallSpeed;
  const float lineAmplitude = 1.0;
  const float lineFrequency = 0.2;
  const float warpSpeed = 0.2 * overallSpeed;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 1.0;
  const float offsetFrequency = 0.5;
  const float offsetSpeed = 1.33 * overallSpeed;
  const float minOffsetSpread = 0.6;
  const float maxOffsetSpread = 2.0;
  const int linesPerGroup = 16;

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
  #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

  float drawCrispLineF(float pos, float halfWidth, float t) {
    return smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - t));
  }
  float drawPeriodicLineF(float freq, float width, float t) {
    return drawCrispLineF(freq / 2.0, width, abs(mod(t, freq) - freq / 2.0));
  }
  float drawGridLines(float axis) {
    return drawCrispLineF(0.0, axisWidth, axis)
          + drawPeriodicLineF(majorLineFrequency, majorLineWidth, axis)
          + drawPeriodicLineF(minorLineFrequency, minorLineWidth, axis);
  }
  float drawGrid(vec2 space) {
    return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
  }
  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }
  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
    float verticalFade   = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    vec4 lines = vec4(0.0);

    for (int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime     = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand           = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth      = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset         = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition   = getPlasmaY(space.x, horizontalFade, offset);
      float line           = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0
                           + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      vec2  circlePos = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
      float circle  = drawCircle(circlePos, 0.01, space) * 4.0;

      lines += (line + circle) * lineColor * rand;
    }

    vec4 fragColor = mix(vec4(0.1, 0.1, 0.3, 1.0), vec4(0.3, 0.1, 0.5, 1.0), uv.x);
    fragColor     *= verticalFade;
    fragColor.a    = 1.0;
    fragColor     += lines;

    gl_FragColor = fragColor;
  }
`

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initShaderProgram(gl) {
  const vert = loadShader(gl, gl.VERTEX_SHADER, VS_SOURCE)
  const frag = loadShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE)
  const prog = gl.createProgram()
  gl.attachShader(prog, vert)
  gl.attachShader(prog, frag)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  return prog
}

export default function ShaderBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const prog = initShaderProgram(gl)
    if (!prog) return

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const attrib  = gl.getAttribLocation(prog, 'aVertexPosition')
    const uRes    = gl.getUniformLocation(prog, 'iResolution')
    const uTime   = gl.getUniformLocation(prog, 'iTime')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)
    resize()

    let raf
    const t0 = Date.now()
    const render = () => {
      const t = (Date.now() - t0) / 1000
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(prog)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(attrib)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}
