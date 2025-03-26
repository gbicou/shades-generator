import Color from 'colorjs.io'

interface TwShade {
    level: number
    css: string
}

export function tw(base: string): TwShade[] {

    const ref = new Color(base)
    const lDelta = 0 // -0.2

    const rangeRef = 500
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

    const refL = ref.oklch.l + lDelta

    return ranges.map((r) => {
        let l = refL
        if (r < rangeRef) {
            const mL = (1 - refL) / rangeRef
            l = 1 - r * mL
        }
        if (r > rangeRef) {
            const mL = refL / (1000 - rangeRef)
            l = refL - (r - rangeRef) * mL
        }
        const shade: Color = ref.clone().to('oklch')
        shade.l = l

        return { level: r, css: shade.toString() }
    })
}
