import Color from 'colorjs.io'
import {Bezier} from "bezier-js";

export enum ShadesProjection {
    LINEAR = 'linear',
    BEZIER = 'bezier'
}

export interface ShadesOptions {
    delta?: number
    rangeBase?: number
    projection: ShadesProjection
}

export interface Shade {
    level: number
    css: string
}

/**
 * Linear projection with a reference point for two segments
 *
 * |                   ______
 * |       ______------
 * |    __+
 * |__--
 * +-------------------------
 *
 * @param x0
 * @param x1
 * @param y0
 * @param y1
 * @param px
 * @param py
 */
const linearProjection = (x0: number, x1: number, y0: number, y1: number, px: number, py: number)=> {
    const slopeSub = (py - y0) / (px - x0);
    const slopeSup = (y1 - py) / (x1 - px);

    return (x: number) => {
        if (x < px) {
            return y0 + slopeSub * (x - x0);
        }
        if (x > px) {
            return py + slopeSup * (x - px);
        }
        return py
    }
}

const bezierProjection = (x0: number, x1: number, y0: number, y1: number, px: number, py: number)=> {
    const curve = Bezier.quadraticFromPoints({x: x0, y: y0}, {x: px, y: py}, {x: x1, y: y1}, 0.5);

    return (x: number) => {
        const intersection = curve
            .intersects({p1: {x, y: 0}, p2: {x, y: 1}})
            .map((t) => curve.get(t))
            .find((p) => p.y >= 0 && p.y <= 1);
        return intersection?.y ?? 0
    }
}

export function shades(base: string, options?: ShadesOptions): Shade[] {
    const baseColor = new Color(base)

    const ranges = [
        50,
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
        950,
    ]
    const rangeBase = options?.rangeBase ?? 500

    const lDelta = options?.delta ?? 0
    const lBase = baseColor.oklch.l + lDelta

    const projection = (options?.projection === ShadesProjection.BEZIER)
        ? bezierProjection(0, 1000, 1, 0, rangeBase, lBase)
        : linearProjection(0, 1000, 1, 0, rangeBase, lBase)

    return ranges.map((r) => {
        const lTarget = projection(r)

        const shade: Color = baseColor.clone().to('oklch')
        shade.l = lTarget

        return { level: r, css: shade.toString() }
    })
}
