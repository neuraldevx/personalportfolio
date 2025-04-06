"use client";
import { useEffect, useRef } from "react";

// --- Interfaces ---
interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: [number, number, number]; // Use tuple for RGB
}

interface FBO {
  texture: WebGLTexture | null;
  fbo: WebGLFramebuffer | null;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach(id: number): number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap(): void;
}

// Simplified WebGL context extension info
interface WebGLExtensions {
  formatRGBA: { internalFormat: number; format: number } | null;
  formatRG: { internalFormat: number; format: number } | null;
  formatR: { internalFormat: number; format: number } | null;
  halfFloatTexType: number | null;
  supportLinearFiltering: boolean;
}

// --- Component Props ---
interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number; // Currently unused in this simplified version
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean; // Background transparency
}

// Placeholder types for refs declared outside useEffect
type ProgramPlaceholder = any;
type MaterialPlaceholder = any;

// --- Component Implementation ---
function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1024,
  // CAPTURE_RESOLUTION = 512, // Unused
  DENSITY_DISSIPATION = 1, // Restored default
  VELOCITY_DISSIPATION = 0.2, // Restored default
  PRESSURE = 0.8,
  PRESSURE_ITERATIONS = 20,
  CURL = 30,
  SPLAT_RADIUS = 0.25,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 }, // Transparent black background
  TRANSPARENT,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // --- State Refs --- (useRef calls at the top level)
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const extRef = useRef<WebGLExtensions | null>(null);
  const pointersRef = useRef<Pointer[]>([{
      id: -1, texcoordX: 0, texcoordY: 0, prevTexcoordX: 0, prevTexcoordY: 0,
      deltaX: 0, deltaY: 0, down: false, moved: false, color: [0.5, 0.5, 0.5]
  }]);
  // Initialize configRef with props - this is fine here
  const configRef = useRef<Required<SplashCursorProps> & { PAUSED: boolean }>({
      SIM_RESOLUTION, DYE_RESOLUTION, CAPTURE_RESOLUTION: 512, DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION, PRESSURE, PRESSURE_ITERATIONS, CURL, SPLAT_RADIUS,
      SPLAT_FORCE, SHADING, COLOR_UPDATE_SPEED, BACK_COLOR,
      TRANSPARENT: TRANSPARENT ?? true, // Ensure default
      PAUSED: false
  });
  const dyeRef = useRef<DoubleFBO | null>(null);
  const velocityRef = useRef<DoubleFBO | null>(null);
  const divergenceRef = useRef<FBO | null>(null);
  const curlRef = useRef<FBO | null>(null);
  const pressureRef = useRef<DoubleFBO | null>(null);
  // These refs hold instances of classes/functions defined inside useEffect, initialize simply
  const programsRef = useRef<Record<string, ProgramPlaceholder>>({}); // Use placeholder type
  const materialsRef = useRef<Record<string, MaterialPlaceholder>>({}); // Use placeholder type
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const colorUpdateTimerRef = useRef<number>(0);
  const blitRef = useRef<((target: FBO | null, clear?: boolean) => void) | null>(null); // Use function type or null

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- WebGL Context & Extensions ---
    function getWebGLContext(canvas: HTMLCanvasElement): { gl: WebGLRenderingContext | WebGL2RenderingContext | null; ext: WebGLExtensions | null } {
        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let glContext: RenderingContext | null = canvas.getContext('webgl2', params);
        let isWebGL2 = glContext instanceof WebGL2RenderingContext;

        if (!glContext || !isWebGL2) {
            glContext = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
            isWebGL2 = false; // Ensure isWebGL2 is false if we fell back to WebGL1
        }

        // Ensure we have a valid WebGL context (either v1 or v2)
        if (!glContext || !(glContext instanceof WebGLRenderingContext || glContext instanceof WebGL2RenderingContext)) {
            console.error('WebGL is not supported or context type is invalid.');
            return { gl: null, ext: null };
        }

        // Now we know glContext is either WebGLRenderingContext or WebGL2RenderingContext
        const gl = glContext as WebGLRenderingContext | WebGL2RenderingContext;

        let halfFloat: OES_texture_half_float | null = null;
        let supportLinearFilteringExt: OES_texture_float_linear | OES_texture_half_float_linear | null = null;

        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFilteringExt = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFilteringExt = gl.getExtension('OES_texture_half_float_linear');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        const halfFloatTexType = isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : (halfFloat ? halfFloat.HALF_FLOAT_OES : null);
        const supportLinearFiltering = !!supportLinearFilteringExt;

        let formatRGBA: { internalFormat: number; format: number } | null = null;
        let formatRG: { internalFormat: number; format: number } | null = null;
        let formatR: { internalFormat: number; format: number } | null = null;

        if (halfFloatTexType) {
            if (isWebGL2) {
                const gl2 = gl as WebGL2RenderingContext;
                formatRGBA = getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType, supportLinearFiltering);
                formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType, supportLinearFiltering);
                formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType, supportLinearFiltering);
            } else {
                formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType, supportLinearFiltering);
                formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType, supportLinearFiltering); // WebGL1 fallback for RG
                formatR = getSupportedFormat(gl, gl.LUMINANCE, gl.LUMINANCE, halfFloatTexType, supportLinearFiltering); // WebGL1 fallback for R
            }
        } else {
            console.error('Half float texture type not supported.');
        }

         // Update config based on support
        configRef.current.SHADING = configRef.current.SHADING && supportLinearFiltering;
        configRef.current.DYE_RESOLUTION = supportLinearFiltering ? configRef.current.DYE_RESOLUTION : 512;

        return {
            gl,
            ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering }
        };
    }

    function getSupportedFormat(
        glContext: WebGLRenderingContext | WebGL2RenderingContext,
        internalFormat: number,
        format: number,
        type: number,
        supportLinearFiltering: boolean
    ): { internalFormat: number; format: number } | null {
        if (!supportRenderTextureFormat(glContext, internalFormat, format, type)) {
            if (glContext instanceof WebGL2RenderingContext) {
                switch (internalFormat) {
                    case glContext.R16F: return getSupportedFormat(glContext, glContext.RG16F, glContext.RG, type, supportLinearFiltering);
                    case glContext.RG16F: return getSupportedFormat(glContext, glContext.RGBA16F, glContext.RGBA, type, supportLinearFiltering);
                    default: return null;
                }
            } else {
                // WebGL1 doesn't have R16F/RG16F, provide fallbacks if needed or return null
                 return null;
            }
        }
        return { internalFormat, format };
    }

    function supportRenderTextureFormat(glContext: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number): boolean {
        let texture = glContext.createTexture();
        if (!texture) return false;
        glContext.bindTexture(glContext.TEXTURE_2D, texture);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

        let fbo = glContext.createFramebuffer();
        if (!fbo) {
            glContext.deleteTexture(texture);
            return false;
        }
        glContext.bindFramebuffer(glContext.FRAMEBUFFER, fbo);
        glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, texture, 0);

        const status = glContext.checkFramebufferStatus(glContext.FRAMEBUFFER);
        // Clean up
        glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
        glContext.deleteFramebuffer(fbo);
        glContext.deleteTexture(texture);

        return status === glContext.FRAMEBUFFER_COMPLETE;
    }


    // --- Shader Compilation & Program Linking ---
    function compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string, keywords?: string[]): WebGLShader | null {
        source = addKeywords(source, keywords);
        const shader = gl.createShader(type);
        if (!shader) {
            console.error(`Error creating shader type ${type}`);
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function addKeywords(source: string, keywords?: string[]): string {
        if (!keywords || keywords.length === 0) return source;
        return keywords.map(keyword => `#define ${keyword}\n`).join('') + source;
    }

    function createProgram(gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        let program = gl.createProgram();
        if (!program) {
             console.error("Failed to create program");
             return null;
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.trace(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    function getUniforms(gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram): Record<string, WebGLUniformLocation | null> {
        let uniforms: Record<string, WebGLUniformLocation | null> = {};
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = gl.getActiveUniform(program, i);
            if (uniformInfo) {
                 uniforms[uniformInfo.name] = gl.getUniformLocation(program, uniformInfo.name);
            }
        }
        return uniforms;
    }

    // --- Material & Program Definitions (Classes) ---
    class Material { // Define Material class first
        vertexShader: WebGLShader | null;
        fragmentShaderSource: string;
        programs: { [hash: number]: WebGLProgram | null } = {};
        activeProgram: WebGLProgram | null = null;
        uniforms: Record<string, WebGLUniformLocation | null> = {};

        constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader | null, fragmentShaderSource: string) {
            this.vertexShader = vertexShader;
            this.fragmentShaderSource = fragmentShaderSource;
            // No program compilation here, done in setKeywords
        }

        setKeywords(gl: WebGLRenderingContext | WebGL2RenderingContext, keywords: string[]) {
            let hash = 0;
            for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]); // Ensure hashCode exists

            let program = this.programs[hash];
            if (program === undefined) {
                if (!this.vertexShader) {
                    console.error("Material has no vertex shader.");
                    return;
                }
                let fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
                if (!fragmentShader) {
                     console.error("Failed to compile fragment shader for material keywords:", keywords);
                     this.programs[hash] = null;
                     return;
                }
                program = createProgram(gl, this.vertexShader, fragmentShader);
                this.programs[hash] = program;
                gl.deleteShader(fragmentShader);
            }

            if (program === this.activeProgram) return;

            if (program) {
                 this.uniforms = getUniforms(gl, program);
            }
            this.activeProgram = program;
        }

        bind(gl: WebGLRenderingContext | WebGL2RenderingContext) {
            if (this.activeProgram) {
                gl.useProgram(this.activeProgram);
            }
        }
    }

    class Program { // Define Program class after Material
        uniforms: Record<string, WebGLUniformLocation | null> = {};
        program: WebGLProgram | null;

        constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null) {
            if (!vertexShader || !fragmentShader) {
                console.error("Cannot create program with null shaders.");
                this.program = null;
                return;
            }
            this.program = createProgram(gl, vertexShader, fragmentShader);
            if (this.program) {
                this.uniforms = getUniforms(gl, this.program);
            } else {
                this.uniforms = {};
            }
        }

        bind(gl: WebGLRenderingContext | WebGL2RenderingContext) {
            if (this.program) {
                gl.useProgram(this.program);
            }
        }
    }

    // --- Shader Sources ---
    const baseVertexShaderSource = `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }`;
    const copyShaderSource = `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }`;
    const clearShaderSource = `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }`;
    const displayShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;

        vec3 linearToGamma (vec3 color) {
            color = max(color, vec3(0.0));
            return max(1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, vec3(0.0));
        }

        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
                // Simple shading - can be enhanced
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;
                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);
                vec3 n = normalize(vec3(dx * 0.5, dy * 0.5, length(texelSize))); // Adjust normal calculation
                vec3 l = normalize(vec3(0.1, 0.3, 1.0)); // Simple light direction
                float diffuse = clamp(dot(n, l) * 0.7 + 0.3, 0.0, 1.0); // Adjust diffuse
                c *= diffuse;
            #endif
            //float a = max(max(c.r, c.g), c.b); // Alpha based on max component
            gl_FragColor = vec4(linearToGamma(c), 1.0); // Apply gamma correction, full alpha for now
        }`;
    const splatShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }`;
    const advectionShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize; // Texel size of velocity texture
        uniform vec2 dyeTexelSize; // Texel size of the source/dye texture
        uniform float dt;
        uniform float dissipation;

        // Function to perform bilinear interpolation manually if needed
        vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            // Calculate the coordinate from where to fetch the value by tracing back along the velocity field
            #ifdef MANUAL_FILTERING
                // Use manual bilinear interpolation if linear filtering is not supported
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy; // Removed * texelSize here, depends on velocity unit
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                // Use hardware linear interpolation if supported
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                vec2 coord = vUv - dt * velocity; // Removed * texelSize here
                vec4 result = texture2D(uSource, coord);
            #endif

            // Apply dissipation (decay)
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }`;
    const divergenceShaderSource = `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;
            // Handle boundary conditions: treat flow as zero across boundaries
            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.01) L = 0.0; // Use small epsilon
            if (vR.x > 0.99) R = 0.0;
            if (vB.y < 0.01) B = 0.0;
            if (vT.y > 0.99) T = 0.0;
            float div = 0.5 * (R - L + T - B); // Central difference divergence
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }`;
    const curlShaderSource = `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B; // Central difference curl (2D)
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }`;
    const vorticityShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl; // Vorticity confinement strength
        uniform float dt;
        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x; // Curl at the center point
            // Calculate the gradient of the curl magnitude
            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            // Normalize the gradient and multiply by curl magnitude and strength
            float MIN_FORCE_LENGTH = 1e-5; // Prevent division by zero or near-zero
            float force_len = length(force);
             if (force_len > MIN_FORCE_LENGTH) {
                force = normalize(force) * C * curl;
             } else {
                force = vec2(0.0);
             }
            // Apply the vorticity confinement force to the velocity field
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            // Clamp velocity to prevent excessive speeds (optional)
            // velocity = clamp(velocity, -1000.0, 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }`;
    const pressureShaderSource = `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float divergence = texture2D(uDivergence, vUv).x;
            // Jacobi iteration for pressure solve
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }`;
    const gradientSubtractShaderSource = `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            // Subtract the pressure gradient from the velocity field
            velocity.xy -= 0.5 * vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }`;


    // --- FBO Management ---
    function createFBO(gl: WebGLRenderingContext | WebGL2RenderingContext, w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO | null {
        gl.activeTexture(gl.TEXTURE0);
        const texture = gl.createTexture();
        if (!texture) return null;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

        const fbo = gl.createFramebuffer();
         if (!fbo) {
             gl.deleteTexture(texture);
             return null;
         }
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let texelSizeX = 1.0 / w;
        let texelSizeY = 1.0 / h;

        // Unbind FBO after creation/setup
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return {
            texture, fbo, width: w, height: h, texelSizeX, texelSizeY,
            attach(id: number) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                return id;
            }
        };
    }

    function createDoubleFBO(gl: WebGLRenderingContext | WebGL2RenderingContext, w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO | null {
        let fbo1: FBO | null = null;
        let fbo2: FBO | null = null;
        try {
             fbo1 = createFBO(gl, w, h, internalFormat, format, type, param);
             fbo2 = createFBO(gl, w, h, internalFormat, format, type, param);
             if (!fbo1 || !fbo2) throw new Error("FBO creation failed");
        } catch (e) {
            console.error("Error creating Double FBO:", e);
            if (fbo1) {
                if (fbo1.texture) gl.deleteTexture(fbo1.texture);
                if (fbo1.fbo) gl.deleteFramebuffer(fbo1.fbo);
            }
             if (fbo2) { // Should not happen if fbo1 failed, but check anyway
                if (fbo2.texture) gl.deleteTexture(fbo2.texture);
                if (fbo2.fbo) gl.deleteFramebuffer(fbo2.fbo);
            }
            return null;
        }


        return {
            width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
            get read() { return fbo1 as FBO }, // Type assertion after check
            set read(value: FBO) { fbo1 = value },
            get write() { return fbo2 as FBO }, // Type assertion after check
            set write(value: FBO) { fbo2 = value },
            swap() {
                let temp = fbo1;
                fbo1 = fbo2;
                fbo2 = temp;
            }
        };
    }

    // --- Blitting Utility ---
    function createBlit(gl: WebGLRenderingContext | WebGL2RenderingContext): ((target: FBO | null, clear?: boolean) => void) | null {
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) return null;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
         if (!indexBuffer) {
            gl.deleteBuffer(vertexBuffer);
            return null;
         }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

        // Ensure vertex attrib array 0 is enabled (can conflict if other code uses it)
        // It's safer to get the attribute location from a simple shader program used for blitting.
        // For simplicity here, we assume location 0 is usable.
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

         // Return cleanup function as well if needed? For now, keep buffers alive.

        return (target: FBO | null, clear = false) => {
            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            } else {
                if (!target.fbo) {
                     console.error("Attempting to blit to an invalid FBO");
                     return;
                }
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            }
            if (clear) {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            // Ensure buffers are bound before drawing (good practice)
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
    }


    // --- Utility Functions ---
    function getResolution(gl: WebGLRenderingContext | WebGL2RenderingContext, resolution: number): { width: number; height: number } {
        let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
        const min = Math.round(resolution);
        const max = Math.round(resolution * aspectRatio);
        return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    function scaleByPixelRatio(input: number): number {
        const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        return Math.floor(input * pixelRatio);
    }

     function hashCode(s: string): number {
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function wrap(value: number, min: number, max: number): number {
        const range = max - min;
        if (range === 0) return min;
        return ((value - min) % range + range) % range + min; // Handles negative values correctly
    }

     function HSVtoRGB(h: number, s: number, v: number): [number, number, number] {
        let r=0, g=0, b=0;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return [r, g, b];
    }

     // --- Theme-based Color Generation ---
    function generateColor(): [number, number, number] {
        // Theme: Use desaturated blues/purples
        const hue = Math.random(); // Full hue range
        const saturation = 0.6 + Math.random() * 0.3; // Higher saturation
        const value = 0.9 + Math.random() * 0.1; // Bright value

        const [r, g, b] = HSVtoRGB(hue, saturation, value);
        // Scale intensity down for the splats
        const intensity = 0.15;
        return [r * intensity, g * intensity, b * intensity];
    }

    // --- Main Simulation Step ---
    function step(gl: WebGLRenderingContext | WebGL2RenderingContext, dt: number) {
        const config = configRef.current;
        const vel = velocityRef.current;
        const dy = dyeRef.current;
        const cur = curlRef.current;
        const div = divergenceRef.current;
        const pres = pressureRef.current;
        const programs = programsRef.current;

        // Check if all necessary resources are available
        if (!vel || !dy || !cur || !div || !pres || !programs.curl || !programs.vorticity || !programs.divergence || !programs.clear || !programs.pressure || !programs.gradienSubtract || !programs.advection) {
             console.warn("Skipping simulation step due to missing resources.");
             return;
        }

        gl.disable(gl.BLEND);
        gl.viewport(0, 0, vel.width, vel.height); // Use velocity resolution for most steps

        // Calculate Curl
        programs.curl.bind();
        gl.uniform2f(programs.curl.uniforms?.['texelSize'], vel.texelSizeX, vel.texelSizeY);
        gl.uniform1i(programs.curl.uniforms?.['uVelocity'], vel.read.attach(0));
        blitRef.current?.(cur);

        // Vorticity Confinement
        programs.vorticity.bind();
        gl.uniform2f(programs.vorticity.uniforms?.['texelSize'], vel.texelSizeX, vel.texelSizeY);
        gl.uniform1i(programs.vorticity.uniforms?.['uVelocity'], vel.read.attach(0));
        gl.uniform1i(programs.vorticity.uniforms?.['uCurl'], cur.attach(1));
        gl.uniform1f(programs.vorticity.uniforms?.['curl'], config.CURL);
        gl.uniform1f(programs.vorticity.uniforms?.['dt'], dt);
        blitRef.current?.(vel.write);
        vel.swap();

        // Calculate Divergence
        programs.divergence.bind();
        gl.uniform2f(programs.divergence.uniforms?.['texelSize'], vel.texelSizeX, vel.texelSizeY);
        gl.uniform1i(programs.divergence.uniforms?.['uVelocity'], vel.read.attach(0));
        blitRef.current?.(div);

        // Clear Pressure Field
        programs.clear.bind();
        gl.uniform1i(programs.clear.uniforms?.['uTexture'], pres.read.attach(0));
        gl.uniform1f(programs.clear.uniforms?.['value'], config.PRESSURE); // Using PRESSURE as a damping factor here? Usually 0.
        blitRef.current?.(pres.write);
        pres.swap();

        // Pressure Iteration (Jacobi Solver)
        programs.pressure.bind();
        gl.uniform2f(programs.pressure.uniforms?.['texelSize'], vel.texelSizeX, vel.texelSizeY);
        gl.uniform1i(programs.pressure.uniforms?.['uDivergence'], div.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(programs.pressure.uniforms?.['uPressure'], pres.read.attach(1));
            blitRef.current?.(pres.write);
            pres.swap();
        }

        // Subtract Pressure Gradient from Velocity
        programs.gradienSubtract.bind();
        gl.uniform2f(programs.gradienSubtract.uniforms?.['texelSize'], vel.texelSizeX, vel.texelSizeY);
        gl.uniform1i(programs.gradienSubtract.uniforms?.['uPressure'], pres.read.attach(0));
        gl.uniform1i(programs.gradienSubtract.uniforms?.['uVelocity'], vel.read.attach(1));
        blitRef.current?.(vel.write);
        vel.swap();

        // Advect Velocity Field by Itself
        programs.advection.bind();
        gl.uniform2f(programs.advection.uniforms?.['texelSize'], vel.texelSizeX, vel.texelSizeY); // Velocity texel size
        if (!extRef.current?.supportLinearFiltering) {
            gl.uniform2f(programs.advection.uniforms?.['dyeTexelSize'], vel.texelSizeX, vel.texelSizeY);
        }
        const velocityTextureId = vel.read.attach(0);
        gl.uniform1i(programs.advection.uniforms?.['uVelocity'], velocityTextureId);
        gl.uniform1i(programs.advection.uniforms?.['uSource'], velocityTextureId); // Advect velocity
        gl.uniform1f(programs.advection.uniforms?.['dt'], dt);
        gl.uniform1f(programs.advection.uniforms?.['dissipation'], config.VELOCITY_DISSIPATION);
        blitRef.current?.(vel.write);
        vel.swap();

        // Advect Dye Field by Velocity Field
        gl.viewport(0, 0, dy.width, dy.height); // Use dye resolution for this step
        // Re-bind advection program (might not be strictly necessary but safer)
        programs.advection.bind();
         if (!extRef.current?.supportLinearFiltering) {
            gl.uniform2f(programs.advection.uniforms?.['dyeTexelSize'], dy.texelSizeX, dy.texelSizeY);
        }
        gl.uniform1i(programs.advection.uniforms?.['uVelocity'], vel.read.attach(0)); // Use final velocity
        gl.uniform1i(programs.advection.uniforms?.['uSource'], dy.read.attach(1));   // Advect dye
        gl.uniform1f(programs.advection.uniforms?.['dissipation'], config.DENSITY_DISSIPATION);
        blitRef.current?.(dy.write);
        dy.swap();
    }

     // --- Rendering ---
    function render(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        const config = configRef.current;
        const dy = dyeRef.current;
        const materials = materialsRef.current;
        if (!dy || !materials.displayMaterial) return;

        // Clear the drawing buffer
        const { r, g, b } = config.BACK_COLOR;
        gl.clearColor(r, g, b, config.TRANSPARENT ? 0.0 : 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the dye texture to the screen
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // Standard alpha blending
        gl.enable(gl.BLEND);

        materials.displayMaterial.bind(gl);
        if (config.SHADING && materials.displayMaterial.activeProgram) {
            gl.uniform2f(materials.displayMaterial.uniforms.texelSize, 1.0 / gl.drawingBufferWidth, 1.0 / gl.drawingBufferHeight);
        }
        gl.uniform1i(materials.displayMaterial.uniforms.uTexture, dy.read.attach(0));

        blitRef.current?.(null); // Blit to screen

        gl.disable(gl.BLEND);
    }

    // --- Splatting (Adding Density/Velocity) ---
    function splat(gl: WebGLRenderingContext | WebGL2RenderingContext, x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
        const config = configRef.current;
        const vel = velocityRef.current;
        const dye = dyeRef.current;
        const programs = programsRef.current;

         if (!vel || !dye || !programs.splat || !canvas) return;

        gl.viewport(0, 0, vel.width, vel.height);
        programs.splat.bind();
        gl.uniform1i(programs.splat.uniforms?.['uTarget'], vel.read.attach(0));
        gl.uniform1f(programs.splat.uniforms?.['aspectRatio'], canvas.width / canvas.height);
        gl.uniform2f(programs.splat.uniforms?.['point'], x, y);
        gl.uniform3f(programs.splat.uniforms?.['color'], dx, dy, 0.0); // Add velocity
        gl.uniform1f(programs.splat.uniforms?.['radius'], correctRadius(config.SPLAT_RADIUS));
        blitRef.current?.(vel.write);
        vel.swap();

        gl.viewport(0, 0, dye.width, dye.height);
        // Program already bound
        gl.uniform1i(programs.splat.uniforms?.['uTarget'], dye.read.attach(0));
        gl.uniform3f(programs.splat.uniforms?.['color'], color[0], color[1], color[2]); // Add color
        blitRef.current?.(dye.write);
        dye.swap();
    }

    function correctRadius(radius: number): number {
         if (!canvas) return radius;
        const aspectRatio = canvas.width / canvas.height;
        // Adjust radius based on aspect ratio to maintain circular appearance
        return aspectRatio > 1 ? radius / aspectRatio : radius;
    }


    // --- Input Handling ---
    function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
        if (!canvas) return;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height; // Invert Y

        const dx = pointer.texcoordX - pointer.prevTexcoordX;
        const dy = pointer.texcoordY - pointer.prevTexcoordY;
        pointer.deltaX = correctDeltaX(dx);
        pointer.deltaY = correctDeltaY(dy);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

     function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
        if (!canvas) return;
        pointer.id = id;
        pointer.down = true;
        pointer.moved = false;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        pointer.color = generateColor();
    }

     function updatePointerUpData(pointer: Pointer) {
        pointer.down = false;
    }

    function correctDeltaX(delta: number): number {
        if (!canvas) return delta;
        const aspectRatio = canvas.width / canvas.height;
        return aspectRatio < 1 ? delta * aspectRatio : delta;
    }

     function correctDeltaY(delta: number): number {
        if (!canvas) return delta;
        const aspectRatio = canvas.width / canvas.height;
        return aspectRatio > 1 ? delta / aspectRatio : delta;
    }

    function applyInputs(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        pointersRef.current.forEach(p => {
            if (p.moved) {
                splat(gl, p.texcoordX, p.texcoordY, p.deltaX * configRef.current.SPLAT_FORCE, p.deltaY * configRef.current.SPLAT_FORCE, p.color);
                p.moved = false;
            }
        });
    }

     function clickSplat(gl: WebGLRenderingContext | WebGL2RenderingContext, pointer: Pointer) {
        const clickColor = generateColor(); // Maybe a different color/intensity for clicks?
        splat(gl, pointer.texcoordX, pointer.texcoordY,
              (Math.random() - 0.5) * 5000, // Random impulse dx
              (Math.random() - 0.5) * 5000, // Random impulse dy
              clickColor);
    }

    // --- Update Loop ---
    function updateFrame() {
         const gl = glRef.current;
         if (!gl) {
             console.error("Render loop stopped: GL context lost.");
             if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
             animationFrameIdRef.current = null;
             return;
         };

        const now = Date.now();
        const dt = Math.min((now - lastUpdateTimeRef.current) / 1000, 0.01666); // Delta time capped at ~60fps
        lastUpdateTimeRef.current = now;

        if (resizeCanvas()) {
             if (!initFramebuffers(gl)) { // Re-init FBOs on resize
                 console.error("Stopping animation due to FBO re-initialization failure.");
                 if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
                 animationFrameIdRef.current = null;
                 return;
             }
        }

        updateColors(dt);
        applyInputs(gl);
        if (!configRef.current.PAUSED) {
            step(gl, dt);
        }
        render(gl);

        animationFrameIdRef.current = requestAnimationFrame(updateFrame);
    }

    function resizeCanvas(): boolean {
        if (!canvas || !glRef.current) return false;
        const width = scaleByPixelRatio(canvas.clientWidth);
        const height = scaleByPixelRatio(canvas.clientHeight);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            // Update viewport for the main drawing buffer
            glRef.current.viewport(0, 0, glRef.current.drawingBufferWidth, glRef.current.drawingBufferHeight);
            return true;
        }
        return false;
    }

     function updateColors(dt: number) {
        const speed = configRef.current.COLOR_UPDATE_SPEED;
        if (speed <= 0) return; // Don't update if speed is 0 or less
        colorUpdateTimerRef.current += dt * speed;
        if (colorUpdateTimerRef.current >= 1) {
            colorUpdateTimerRef.current = wrap(colorUpdateTimerRef.current, 0, 1);
            // Update the base color for the next splat for active pointers
            pointersRef.current.forEach(p => {
                 if(p.down || p.moved){ // Only update color if pointer is active? Or always?
                     p.color = generateColor();
                 }
            });
        }
    }

    // --- Initialization Function ---
    function initGL(canvasElement: HTMLCanvasElement) {
        if (!canvasElement) {
            console.error("initGL called without a valid canvas element.");
            return false;
        }

        const contextResult = getWebGLContext(canvasElement);
        glRef.current = contextResult.gl;
        extRef.current = contextResult.ext;
        const gl = glRef.current;
        const ext = extRef.current;

        if (!gl || !ext || !ext.formatRGBA || !ext.formatRG || !ext.formatR || !ext.halfFloatTexType) {
            console.error("Failed to initialize WebGL context or required extensions.");
            return false; // Indicate failure
        }

        // Create Blit function
        const blitFn = createBlit(gl);
        if (!blitFn) {
             console.error("Failed to create blit function.");
             return false;
        }
        blitRef.current = blitFn;


        // Compile Shaders
        const baseVertexShader = compileShader(gl, gl.VERTEX_SHADER, baseVertexShaderSource);
        if (!baseVertexShader) return false;

        const compileFrag = (source: string, keywords?: string[]) => compileShader(gl, gl.FRAGMENT_SHADER, source, keywords);

        const copyShader = compileFrag(copyShaderSource);
        const clearShader = compileFrag(clearShaderSource);
        const displayShader = compileFrag(displayShaderSource, configRef.current.SHADING ? ['SHADING'] : undefined);
        const splatShader = compileFrag(splatShaderSource);
        const advectionShader = compileFrag(advectionShaderSource, ext.supportLinearFiltering ? undefined : ['MANUAL_FILTERING']);
        const divergenceShader = compileFrag(divergenceShaderSource);
        const curlShader = compileFrag(curlShaderSource);
        const vorticityShader = compileFrag(vorticityShaderSource);
        const pressureShader = compileFrag(pressureShaderSource);
        const gradientSubtractShader = compileFrag(gradientSubtractShaderSource);

        // Check all shaders compiled
        if (!copyShader || !clearShader || !displayShader || !splatShader || !advectionShader || !divergenceShader || !curlShader || !vorticityShader || !pressureShader || !gradientSubtractShader) {
            console.error("One or more shaders failed to compile.");
            // Basic cleanup of successfully compiled ones
            [baseVertexShader, copyShader, clearShader, displayShader, splatShader, advectionShader, divergenceShader, curlShader, vorticityShader, pressureShader, gradientSubtractShader].forEach(s => { if (s) gl.deleteShader(s) });
            return false;
        }

        // Create Programs (and store them)
        const createProg = (frag: WebGLShader) => new Program(gl, baseVertexShader, frag);
        programsRef.current = {
            copyProgram: createProg(copyShader),
            clearProgram: createProg(clearShader),
            splatProgram: createProg(splatShader),
            advectionProgram: createProg(advectionShader),
            divergenceProgram: createProg(divergenceShader),
            curlProgram: createProg(curlShader),
            vorticityProgram: createProg(vorticityShader),
            pressureProgram: createProg(pressureShader),
            gradienSubtractProgram: createProg(gradientSubtractShader),
        };

         // Check all programs linked
        if (Object.values(programsRef.current).some(p => !p || !p.program)) {
            console.error("One or more programs failed to link.");
            // TODO: Cleanup programs and shaders
            return false;
        }

        // Create Materials (and store them)
        materialsRef.current = {
             displayMaterial: new Material(gl, baseVertexShader, displayShaderSource),
        };
         materialsRef.current.displayMaterial?.setKeywords(gl, configRef.current.SHADING ? ['SHADING'] : []);
         if (!materialsRef.current.displayMaterial?.activeProgram) {
            console.error("Display material failed to initialize.");
             // TODO: Cleanup programs and shaders
            return false;
         }


        // Initialize FBOs
        if (!initFramebuffers(gl)) {
            console.error("Framebuffer initialization failed.");
             // TODO: Cleanup programs and shaders
            return false;
        }

        return true; // Initialization successful
    }

    function initFramebuffers(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
        const config = configRef.current;
        const ext = extRef.current;
        if (!ext || !ext.formatRGBA || !ext.formatRG || !ext.formatR || !ext.halfFloatTexType) return false;

        const simRes = getResolution(gl, config.SIM_RESOLUTION);
        const dyeRes = getResolution(gl, config.DYE_RESOLUTION);
        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const rg = ext.formatRG;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

        // Clean up previous FBOs before creating/resizing
        // (Implement FBO cleanup function if needed)

        dyeRef.current = createDoubleFBO(gl, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
        velocityRef.current = createDoubleFBO(gl, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
        divergenceRef.current = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        curlRef.current = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        pressureRef.current = createDoubleFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);

        // Check if all FBOs were created successfully
        return !!(dyeRef.current && velocityRef.current && divergenceRef.current && curlRef.current && pressureRef.current);
    }

    // --- Event Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
        const pointer = pointersRef.current[0];
        updatePointerMoveData(pointer, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY));
    };
    const handleMouseDown = (e: MouseEvent) => {
         const pointer = pointersRef.current[0];
         updatePointerDownData(pointer, -1, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY));
         if (glRef.current) clickSplat(glRef.current, pointer);
    };
    const handleMouseUp = () => updatePointerUpData(pointersRef.current[0]);

     const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault(); // Important to prevent page scroll on canvas touch
        const touches = e.targetTouches;
        if (touches.length > 0) {
            const pointer = pointersRef.current[0];
            updatePointerDownData(pointer, touches[0].identifier, scaleByPixelRatio(touches[0].clientX), scaleByPixelRatio(touches[0].clientY));
             if (glRef.current) clickSplat(glRef.current, pointer);
        }
    };
    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touches = e.targetTouches;
        if (touches.length > 0) {
            const pointer = pointersRef.current[0];
            updatePointerMoveData(pointer, scaleByPixelRatio(touches[0].clientX), scaleByPixelRatio(touches[0].clientY));
        }
    };
    const handleTouchEnd = (e: TouchEvent) => {
         const touches = e.changedTouches;
         for (let i = 0; i < touches.length; i++) {
             if (touches[i].identifier === pointersRef.current[0].id) {
                 updatePointerUpData(pointersRef.current[0]);
                 break;
             }
         }
    };


    // --- Effect Initialization & Cleanup ---
    let isInitialized = false;
    if (canvas) { // Ensure canvas exists before trying to initialize
        try {
            isInitialized = initGL(canvas);
        } catch(error) {
            console.error("Error during WebGL initialization:", error);
            isInitialized = false;
        }
    }

    if (isInitialized) {
        // Add event listeners only if init succeeded
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        // Start animation loop
        lastUpdateTimeRef.current = Date.now(); // Reset timer before starting loop
        animationFrameIdRef.current = requestAnimationFrame(updateFrame);
        console.log("Fluid simulation started.");
    } else {
         console.error("Fluid simulation failed to initialize and start.");
    }

    // Cleanup function
    return () => {
        console.log("Cleaning up fluid simulation.");
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }

        // Remove event listeners
         window.removeEventListener('mousemove', handleMouseMove);
         window.removeEventListener('mousedown', handleMouseDown);
         window.removeEventListener('mouseup', handleMouseUp);
         canvas.removeEventListener('touchstart', handleTouchStart);
         canvas.removeEventListener('touchmove', handleTouchMove);
         window.removeEventListener('touchend', handleTouchEnd);

         // WebGL resource cleanup (Important!)
         const gl = glRef.current;
         if (gl) {
            // Delete Programs
            Object.values(programsRef.current).forEach(p => { if(p?.program) gl.deleteProgram(p.program); });
            // Delete Materials (programs deleted above)
            // Delete Shaders (if kept references, otherwise they are deleted after linking)

            // Delete FBOs and Textures
            const cleanupFBO = (fbo: FBO | null) => {
                if (fbo) {
                    if (fbo.fbo) gl.deleteFramebuffer(fbo.fbo);
                    if (fbo.texture) gl.deleteTexture(fbo.texture);
                }
            };
             const cleanupDoubleFBO = (dfbo: DoubleFBO | null) => {
                if (dfbo) {
                    cleanupFBO(dfbo.read);
                    cleanupFBO(dfbo.write);
                }
            };
            cleanupDoubleFBO(dyeRef.current);
            cleanupDoubleFBO(velocityRef.current);
            cleanupFBO(divergenceRef.current);
            cleanupFBO(curlRef.current);
            cleanupDoubleFBO(pressureRef.current);

            // Delete Buffers used by blit
            // Need references to vertexBuffer and indexBuffer from createBlit if cleaning them up here
            // For now, assume they might be shared or managed elsewhere if createBlit is reused.
            // A more robust approach would return the buffers from createBlit for cleanup.
         }
         glRef.current = null; // Clear the ref
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* Add props that require re-initialization if changed */
      SIM_RESOLUTION, DYE_RESOLUTION, DENSITY_DISSIPATION, VELOCITY_DISSIPATION,
      PRESSURE, PRESSURE_ITERATIONS, CURL, SPLAT_RADIUS, SPLAT_FORCE, SHADING,
      COLOR_UPDATE_SPEED, BACK_COLOR, TRANSPARENT
  ]); // Dependencies array needs careful consideration

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', opacity: 0.5 }} />
    </div>
  );
}

export { SplashCursor };
