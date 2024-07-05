const c = [
    ['#FF4C4C', '#7651FF'],
    ['#2E3192', '#177575'],
    ['#000000', '#000000'],
    ['#3EB6AB', '#3EB6AB'],
    ['#051295', '#c74400'],
    ['#ffcc90', '#ad1212'],
    ['#FFBF00', '#FFBF00'],
    ['#FF7F50', '#FF7F50'],
    ['#DE3163', '#DE3163'],
    ['#9FE2BF', '#9FE2BF'],
    ['#40E0D0', '#40E0D0'],
    ['#6495ED', '#6495ED'],
    ['#CCCCFF', '#CCCCFF'],
    ['#980bff', '#ffdc31'],
    ['#fff772', '#313eff'],
    ['#650075', '#313eff'],
    ['#050075', '#50910f'],
    ['#808000', '#808000'],
    ['#800080', '#800080'],
]

var degrades: {[key: string]: Array<string>} = Object()

for (var i = 0; i < c.length; ++i) {
    degrades['c' + i.toString()] = [changeColor(c[i][0], 100), changeColor(c[i][1], 100), c[i][0], c[i][1]]
}

export const DEGRADES: {[key: string]: string[]} = degrades

export const FAKE_WHITE = '#EFEFEF'

function changeColor(color: string, amount: number) { // #FFF not supportet rather use #FFFFFF
    const clamp = (val: number) => Math.min(Math.max(val, 0), 0xFF)
    const fill = (str: string) => ('00' + str).slice(-2)

    const num = parseInt(color.substr(1), 16)
    const red = clamp((num >> 16) + amount)
    const green = clamp(((num >> 8) & 0x00FF) + amount)
    const blue = clamp((num & 0x0000FF) + amount)
    return '#' + fill(red.toString(16)) + fill(green.toString(16)) + fill(blue.toString(16))
}

