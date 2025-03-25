import Color from 'colorjs.io'

interface TwShade {
    level: number
    css: string
}

export function tw(base: string): TwShade[] {

    const ref = new Color(base)
    const lDelta = 0 // -0.2

   // console.log('reference', ref.oklch)

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
        const shade = ref.clone().to('oklch')
        // const neutral = new Color(colors.neutral[v])
        // shade.oklch.l = neutral.oklch.l
        shade.l = l
        // console.log(r, shade.oklch)

        return { level: r, css: shade.toString({format: 'oklch'}) }
    })
}
