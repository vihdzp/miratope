"use strict";
const ATTEMPTS = 10;

//NOT YET FUNCTIONAL
//Tries to create a uniform polytope with edge length 1 from a given verf, with a given symmetry.
//Doesn't yet work, depends on various methods that haven't been coded yet.
Polytope.createFromVerf = function (V, S) {
  V = V.clone(); //Clones the verf, so that the original isn't modified.

  var A = V.circumcenter(); //Apex of verf pyramid.
  var r = Space.distanceSq(A, V.elementList[0][0]); //Squared circumradius.

  //r has to be less than 1.
  if (r >= 1) throw new Error("Verf's circumradius too big!");

  A.coordinates.push(Math.sqrt(1 - r));
  var P = V.extrudeToPyramid(A); //Verf pyramid.
  var C = P.circumcenter(); //Verf pyramid's circumcenter.
  var d = P.dimensions(); //Dimensions of final polytope.
  P.move(C, -1); //Centers P at the origin.

  //Attempts to build the polytope, until it either succeeds, or after a certain amount of tries, fails.
  for (var ATTEMPT = 1; ATTEMPT <= ATTEMPTS; ATTEMPT++) {
    //Generates a (non-uniformly) random set of angles.
    //This will be used as the starting point for minimization.
    var angles = [];
    for (var i = 0; i < (d * (d - 1)) / 2; i++)
      angles.push(Math.random() * 2 * Math.PI);

    //The core of this function, minimizes a function of the angles.
    //The set of d * (d - 1) / 2 angles define an orthogonal matrix.
    //This matrix moves the verf somewhere on a hypersphere.
    //Under the action of S, each of the verf's vertices has an orbit.
    //We want to find the place where these orbits coincide.
    //When they do, we'll be able to build an isogonal and thus uniform polytope.
    globalThis.P = P;
    globalThis.S = S;
    var sol = Polytope._minimize(Polytope._orbitDistance, angles);

    //Tries again from a new starting point if the minimum wasn't found.
    if (sol.fncvalue > epsilon) continue;

    angles = sol.argument;
    var matrix = Polytope._matrixFromAngles(angles);

    //Generates vertices.
    var elementList = [];
    elementList[0] = P.elementList[0][0].orbitUnder(S);
  }

  console.log("Polytope couldn't be built!");
  return;
};

//An objective function for how "close" the orbits of different vertices are.
//Returns the sum of the smallest distance between points of the orbits i, i + 1 over all i.
//Will return 0 (or something small) iff the orbits are all equal.
Polytope._orbitDistance = function (angles) {
  var matrix = Polytope._matrixFromAngles(angles),
    P = globalThis.P,
    S = globalThis.S,
    res = 0,
    i,
    j;

  //For each vertex of the verf pyramid, creates an array with its orbit under the symmetry group.
  var orbits = [];
  for (i = 0; i < P.elementList[0].length; i++)
    orbits.push(P.elementList[0][i].rotate(matrix).orbitUnder(S));

  //Gets the smallest distance between contiguous orbits.
  //Takes advantage of symmetry: it suffices to calculate the smallest distance
  //between a single vertex of one orbit and the vertices of the other orbit.
  for (i = 0; i < orbits.length - 1; i++) {
    var min = Number.MAX_VALUE;
    for (j = 0; j < orbits[i].length; j++)
      min = Math.min(min, Space.distance(orbits[i][j], orbits[i + 1][0]));
    res += min;
  }

  return res;
};

//Creates an orthogonal matrix.
//It is the composition of the rotations given by angles through the XY, XZ, ... planes.
Polytope._matrixFromAngles = function (angles, d) {
  var result = Matrix.identity(d),
    i,
    j,
    x,
    y;

  for (i = 0; i < d; i++)
    for (j = i + 1; j < d; j++) {
      var factor = Matrix.identity(d);
      var alpha = angles[(d - 2 - (i + 1) / 2) * i + j - 1];
      factor.els[i][i] = Math.cos(alpha);
      factor.els[i][j] = -Math.sin(alpha);
      factor.els[j][i] = Math.sin(alpha);
      factor.els[j][j] = Math.cos(alpha);

      result = result.multiply(new Matrix(factor));
    }

  return result;
};

/**
 * Taken from optimize.js
 * Minimize an unconstrained function using zero order Powell algorithm.
 * @private
 * @param fnc Function to be minimized. This function takes
 * array of size N as an input, and returns a scalar value as output,
 * which is to be minimized.
 * @param x0 An array of values of size N, which is an initialization
 *	to the minimization algorithm.
 * @returns An object instance with two fields: argument, which
 * denotes the best argument found thus far, and fncvalue, which is a
 * value of the function at the best found argument.
 */
Polytope._minimize = function (fnc, x0) {
  var eps = 1e-2;

  var convergence = false;
  var x = x0.slice(); // make copy of initialization
  var alpha = 0.001; // scaling factor

  var pfx = Math.exp(10);
  var fx = fnc(x);
  var pidx = 1;
  while (!convergence) {
    var indicies = shuffleIndiciesOf(x);
    convergence = true;

    // Perform update over all of the variables in random order
    for (var i = 0; i < indicies.length; i++) {
      x[indicies[i]] += 1e-6;
      var fxi = fnc(x);
      x[indicies[i]] -= 1e-6;
      var dx = (fxi - fx) / 1e-6;

      if (Math.abs(dx) > eps) {
        convergence = false;
      }

      x[indicies[i]] = x[indicies[i]] - alpha * dx;
      fx = fnc(x);
    }

    // a simple step size selection rule. Near x function acts linear
    // (this is assumed at least) and thus very small values of alpha
    // should lead to (small) improvement. Increasing alpha would
    // yield better improvement up to certain alpha size.

    alpha = pfx > fx ? alpha * 1.1 : alpha * 0.7;
    pfx = fx;

    pidx--;
    if (pidx === 0) {
      pidx = 1;
    }
  }

  var solution = {};
  solution.argument = x;
  solution.fncvalue = fx;

  return solution;
};
