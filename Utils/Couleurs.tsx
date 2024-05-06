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
function degradeCouleur(rgbDebut: Array<number>, rgbFin: Array<number>, N: number): Array<Array<number>> {
    const r = degradeTableau([rgbDebut[0], rgbFin[0]], N);
    const g = degradeTableau([rgbDebut[1], rgbFin[1]], N);
    const b = degradeTableau([rgbDebut[2], rgbFin[2]], N);

    return [r, g, b]
}

function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


function getRGBColorFromGradient(gradient: Array<Array<number>>, pos: number): string {
    const color = 'rgb(' + gradient[0][pos] + ', ' + gradient[1][pos] + ', ' + gradient[2][pos] + ')';
    return color;
}

export {degradeTableau, degradeCouleur, hexToRgb, getRGBColorFromGradient};
