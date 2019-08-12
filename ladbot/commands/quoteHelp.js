/*
File responsible for paragraph formation from a string.
Is used to support the !quote command (quote.js).
*/

/*
Computes the amount of spaces at the end of a line.
*/
function extraSpace(S, M, i, j) {
	let e = M - j + i;
	for(let x = i; x < j+1; x++) {
		e -= S[x].length;
	}
	return e;
}

/*
Computes the "badness" of a line, determined by the number of extra spaces it has.
*/
function badnessLine(S, M, i, j) {
	let e = extraSpace(S, M, i, j);
	if(e < 0) {
		return Infinity;
	}
	else {
		return e;
	}
}

/*
Uses dynamic programming to compute the "minimum badness" array, which is used to build
a formatted sequence of text (a paragraph using '\n') 
 */
function minBadDynamicChoice(S, M) {
	// Arrays: b = badness array, m = min array, c = choices array (to get final paragraph answer)
	let n = S.length;
	let b = Array.from(Array(n), () => new Array(n));
	let m = new Array(n);
	let c = new Array(n);

	// Compute all badness values for possible i to j word combinations in S
	for(let i = 0; i < n; i++) {
		for(let j = 0; j < n; j++) {
			b[i][j] = badnessLine(S, M, i, j);
		}
	}

	// Now find the correct word-line placement
	for(let x = n-1; x >= 0; x--) {
		m[x] = b[x][n-1];
		c[x] = n;
		for(let y = n-1; y > x; y--) {
			if(m[x] > (m[y] + b[x][y-1])) {
				m[x] = m[y] + b[x][y-1];
				// Modify choice array here
				c[x] = y;
			}
		}
	}
	return c;
}

/*
Using the dynamic programming solution, fetches the actual formatted text
*/
function getParagraph(S, M) {
	// Get choice array
	let c = minBadDynamicChoice(S, M);

	// Compile formatted paragraph
	let paragraph = "";
	let i = 0;
	let j = 0;
	let n = S.length;
	while(j < n) {
		let s = "";
		j = c[i];
		for(let k = i; k < j; k++) {
			s += S[k] + " ";
		}
		i = j;
		paragraph += s + "\n";
	}
	return paragraph.slice(0, -2);
}

// Declare exports
module.exports = {
    "getParagraph" : getParagraph
}