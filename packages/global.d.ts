interface Image {}
declare function sleep (low: number, up?: number): void
declare const $shell: any
declare function Tap (x: number, y: number): void
declare function press (x: number, y: number, delay: number): void
declare function random (low: number, up: number): number
declare function Swipe (x1: number, y1: number, x2: number, y2: number, duration: number): void
declare function gesture (duration: number, ...points: Array<number>): void
declare function captureScreen(path?: string): Image
