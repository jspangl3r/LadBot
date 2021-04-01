/**
 * Text justifcation for a string and width parameter.
 */

/**
 * Computes the amount of spaces at the end of a line.
 */
function extraSpace(S: string, M: number, i: number, j: number): number {
  let e = M - j + i;
  for (let x = i; x < j + 1; x++) {
    e -= S[x].length;
  }
  return e;
}

/**
 * Computes the "badness" of a line, determined by the number of extra spaces it has.
 */
function badnessLine(S: string, M: number, i: number, j: number): number {
  const e = extraSpace(S, M, i, j);
  if (e < 0) {
    return Infinity;
  }

  return e;
}

/**
 * Uses dynamic programming to compute the "minimum badness" array, which is used
 * to build a formatted sequence of text (a paragraph using '\n')
 */
function minBadDynamicChoice(S: string, M: number): number[] {
  // Arrays: b = badness array, m = min array, c = choices array (to get final paragraph answer)
  const n = S.length;
  const b = Array.from(Array(n), () => new Array(n));
  const m = new Array(n);
  const c = new Array(n);

  // Compute all badness values for possible i to j word combinations in S
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      b[i][j] = badnessLine(S, M, i, j);
    }
  }

  // Now find the correct word-line placement
  for (let x = n - 1; x >= 0; x--) {
    m[x] = b[x][n - 1];
    c[x] = n;
    for (let y = n - 1; y > x; y--) {
      if (m[x] > m[y] + b[x][y - 1]) {
        m[x] = m[y] + b[x][y - 1];
        // Modify choice array here
        c[x] = y;
      }
    }
  }
  return c;
}

/**
 * Using the dynamic programming solution, fetches the actual formatted text
 */
export function getParagraph(S: string, M: number): string {
  // Get choice array
  const c = minBadDynamicChoice(S, M);

  // Compile formatted paragraph
  let paragraph = "";
  let i = 0;
  let j = 0;
  const n = S.length;
  while (j < n) {
    let s = "";
    j = c[i];
    for (let k = i; k < j; k++) {
      s += `${S[k]} `;
    }
    i = j;
    paragraph += `${s}\n`;
  }
  return paragraph.slice(0, -2);
}
