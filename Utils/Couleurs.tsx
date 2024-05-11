/**
 * Parameters
 * ----------
 * bornes : [debut, fin] -> Début et fin du domaine de dégradé
 * N : nombre de valeurs à calculer entre début et fin
 * 
 * Returns
 * -------
 * d : Tableau de N valeurs dégradées linéairement entre début et fin
 */
function degradeTableau(bornes: Array<number>, N: number) {
    const d = Array<number>(N);

    const min = Math.min(bornes[0], bornes[1]);
    const max = Math.max(bornes[0], bornes[1]);

    for(var i = 0; i < N; ++i) {
        d[i] = min + i * (max - min) / N;
    }

    if (bornes[0] < bornes[1]) {
        return d;
    }
    else {
        return d.reverse();
    }
}

/**
 * Parameters
 * ----------
 * rgbDebut : Couleur rgb de début de dégradé
 * rgbFin : Couleur rgb de fin de dégradé
 * N : nombre de couleurs intermédiaires à calculer
 * 
 * Returns
 * -------
 * gradient : [r, g, b] -> gradient[0][1] est la 2e valeur du rouge, gradient[2, 5] la 6e du bleu 
 */
function degradeCouleur(hexDebut: string, hexFin: string, N: number): Array<Array<number>> {
    const rgbDebut = hexToRgb(hexDebut)
    const rgbFin = hexToRgb(hexFin)
    const r = degradeTableau([rgbDebut.r, rgbFin.r], N);
    const g = degradeTableau([rgbDebut.g, rgbFin.g], N);
    const b = degradeTableau([rgbDebut.b, rgbFin.b], N);

    return [r, g, b]
}

function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
  }


function getRGBColorFromGradient(gradient: Array<Array<number>>, pos: number): string {
    const color = 'rgb(' + gradient[0][pos] + ', ' + gradient[1][pos] + ', ' + gradient[2][pos] + ')';
    return color;
}

export {degradeTableau, degradeCouleur, hexToRgb, getRGBColorFromGradient};
