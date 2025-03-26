import Color from 'colorjs.io'

interface TwShade {
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
const linearProjection = (x0: number, x1: number, y0: number, y1: number, px: number, py: number)=> (x: number) => {
    if (x < px) {
        const slope = (py - y0) / (px - x0);
        return y0 + slope * (x - x0);
    }
    if (x > px) {
        const slope = (y1 - py) / (x1 - px);
        return py + slope * (x - px);
    }
    return py
}

export function tw(base: string): TwShade[] {

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
    const rangeBase = 500

    const lDelta = 0
    const lBase = baseColor.oklch.l + lDelta

    const linear = linearProjection(0, 1000, 1, 0, rangeBase, lBase)

    return ranges.map((r) => {
        const shade: Color = baseColor.clone().to('oklch')
        shade.l = linear(r)

        return { level: r, css: shade.toString() }
    })
}
