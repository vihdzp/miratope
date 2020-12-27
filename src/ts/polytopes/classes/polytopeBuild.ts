import {
  Antiprism as CNAntiprism,
  Codename as CNCodename,
  Cuploid as CNCuploid,
  Cupola as CNCupola,
  CupolaicBlend as CNCupolaicBlend,
  Polygon as CNPolygon,
  Pyramid as CNPyramid,
  Simplex as CNSimplex,
} from "../../data structures/constructionNode";
import { FlagClass } from "../../data structures/flag";
import { ConcreteGroup } from "../../data structures/group";
import Point from "../../geometry/point";
import { ElementList, PolytopeB, PolytopeC, PolytopeS } from "../polytopeTypes";

/**
 * A class containing various basic methods to generate polytopes.
 *
 * @category Polytope Method
 */
export default abstract class PolytopeBuild {
  /**
   * Simple auxiliary function to get the length of a regular polygon's verf.
   *
   * @param {number} n The number of sides of the polygon.
   * @param {number} d The winding number of the polygon.
   */
  static verfLength(n: number, d?: number): number {
    if (d === undefined) d = 1;
    return 2 * Math.cos(Math.PI / (n / d));
  }

  /**
   * Creates the [[https://polytope.miraheze.org/wiki/Nullitope | nullitope]].
   *
   * @returns {Polytope} An instance of the null polytope.
   */
  static nullitope(): PolytopeB {
    return new PolytopeC([], new CNCodename("nullitope"));
  }

  /**
   * Creates the [[https://polytope.miraheze.org/wiki/Point | point polytope]].
   *
   * @returns An instance of the point polytope.
   */
  static point(): PolytopeB {
    return new PolytopeC([[new Point([])]], new CNCodename("point"));
  }

  /**
   * Creates a [[https://polytope.miraheze.org/wiki/Dyad | dyad]] of a specified
   * length.
   *
   * @param length The length of the dyad.
   * @returns A dyad of the specified length.
   */
  static dyad(length = 1): PolytopeB {
    return new PolytopeC(
      [[new Point([-length / 2]), new Point([length / 2])], [[0, 1]]],
      new CNCodename("dyad")
    );
  }

  /**
   * Builds a polygon from its vertices.
   *
   * @param points The vertices of the polygon.
   * @return The polygon with the specified vertices.
   */
  static polygon(points: Point[]): PolytopeB {
    const newElementList: ElementList = [[], [], [[]]];

    //Adds vertices and the face.
    for (let i = 0; i < points.length; i++) {
      newElementList[0].push(points[i]);
      newElementList[2][0].push(i);
    }

    //Adds edges.
    newElementList[1].push([0, points.length - 1]);
    for (let i = 0; i < points.length - 1; i++)
      newElementList[1].push([i, i + 1]);

    return new PolytopeC(newElementList, new CNPolygon([points.length, 1]));
  }

  /**
   * Builds a regular polygon with a given edge length.
   * @param n The number of sides of the regular polygon.
   * @param d The winding number of the regluar polygon.
   * @returns The regular polygon.
   */
  static regularPolygon(n: number, d?: number): PolytopeB {
    let gcd: number;
    if (d === undefined) {
      d = 1;
      gcd = 1;
    } else gcd = Math.gcd(n, d);

    const els: ElementList = [[], [], []];
    const n_gcd = n / gcd;
    const invRad = 2 * Math.sin((Math.PI * d) / n); //1 / circumradius.

    let angle = 0;
    const t = (2 * Math.PI) / n;
    for (let i = 0; i < n; i++) {
      els[0].push(
        new Point([Math.cos(angle) / invRad, Math.sin(angle) / invRad])
      ); //Vertices
      angle += t;
    }

    let x = 0,
      y = d;
    //i is the component number.
    for (let i = 0; i < gcd; i++) {
      //x and y keep track of the vertices that are being connected.
      const components: number[] = [];
      //j is the edge.
      for (let j = 0; j < n_gcd; j++) {
        els[1].push([x, y]); //Edges
        x = y;
        y += d;
        if (y >= n) y -= n;
        components.push(components.length); //Components
      }
      els[2].push(components);
      x++;
      y++;
    }

    return new PolytopeC(els, new CNPolygon([n, d]));
  }

  /**
   * Builds a Grünbaumian `n`/`d` star.
   *
   * @param n The number of sides of the polygon.
   * @param d The winding number of the polygon.
   * @return The resulting polygon.
   * @todo Replace it by the PolytopeS version.
   */
  static regularPolygonG(n: number, d?: number): PolytopeB {
    if (d === undefined) d = 1;

    const els: ElementList = [[], [], [[]]];

    let angle = 0;
    const t = (Math.PI * d) / n;
    const invRad = 2 * Math.sin(t); //1 / the circumradius

    for (let i = 0; i < n; i++) {
      //Vertices
      els[0].push(
        new Point([Math.cos(angle) / invRad, Math.sin(angle) / invRad])
      );
      //Face.
      els[2][0].push(i);
      angle += 2 * t;
    }

    for (let i = 0; i < n - 1; i++) els[1].push([i, i + 1]); //Edges
    els[1].push([els[0].length - 1, 0]);

    return new PolytopeC(els, new CNPolygon([n, d]));
  }

  /**
   * Builds a semiregular polygon with `n` sides and "absolute turning number"
   * `d` with some given edge lengths.
   * The absolute turning number is the number `d` such that
   * the sum of the angles of the polygon is `π(n - 2d)`.
   * The bowtie is generated by the special case of `n = 4`, `d = 0`,
   * for lack of better parameters.
   *
   * @param n The number of sides of the semiuniform polygon.
   * @param The "absolute turning number", as defined above.
   * @param The first edge length of the polygon.
   * @param The second edge length of the polygon.
   * @return The resulting semiregular polygon.
   */
  static semiregularPolygon(n: number, d = 1, a = 1, b = 1): PolytopeB {
    //If n = 4, d = 0, a bowtie is created.
    //Idk if there are more natural parameters for the bowtie.
    if (n === 4 && d === 0) {
      //If a > b, swaps b and a.
      if (a > b) {
        const t = a;
        a = b;
        b = t;
      }

      b = Math.sqrt(b * b - a * a) / 2;
      a /= 2;
      return new PolytopeC(
        [
          [
            new Point([-a, b]),
            new Point([a, b]),
            new Point([-a, -b]),
            new Point([a, -b]),
          ],
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
          ],
          [[0, 1, 2, 3]],
        ],
        new CNCodename("bowtie")
      );
    }

    //The angles and sides of a triangle made by three adjacent vertices.
    //Also, the circumdiameter 2R.
    const gamma = Math.PI * (1 - (2 * d) / n);
    const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gamma));
    const R = c / Math.sin(gamma) / 2;

    //The sine rule doesn't work here, since asin is multivalued in [0, π/2].
    //Instead, we use the more complicated cosine rule.

    //Actually 2α.
    const alpha = 2 * Math.acos((b * b + c * c - a * a) / (2 * b * c));
    //Actually 2β.
    const beta = 2 * Math.acos((a * a + c * c - b * b) / (2 * a * c));
    let angle = 0;

    const els: ElementList = [[], [], [[]]];

    for (let i = 0; i < n / 2; i++) {
      //Side a.
      //Vertices
      els[0].push(new Point([Math.cos(angle) * R, Math.sin(angle) * R]));
      //Face
      els[2][0].push(2 * i);
      angle += alpha;
      //Side b
      //Vertices
      els[0].push(new Point([Math.cos(angle) * R, Math.sin(angle) * R]));
      //Face
      els[2][0].push(2 * i + 1);
      angle += beta;
    }

    for (let i = 0; i < n - 1; i++) els[1].push([i, i + 1]); //Edges
    els[1].push([els[0].length - 1, 0]);

    return new PolytopeC(els, new CNPolygon([n, d]));
  }

  /**
   * Builds a [[https://polytope.miraheze.org/wiki/Hypercube | hypercube]] with
   * the specified amount of dimensions.
   * Positioned in the standard orientation with edge length 1.
   *
   * @param n The number of dimensions.
   * @return The resulting polytope.
   */
  static hypercube(n: number): PolytopeB {
    const symmetries = ConcreteGroup.BC(n);
    const flagClasses: FlagClass[] = [];
    for (let i = 0; i < n; i++) flagClasses.push([[0, [i]]]);
    const coordinates: number[] = [];
    for (let i = 0; i < n; i++) coordinates.push(0.5);
    const vertices = [new Point(coordinates)];
    return new PolytopeS(symmetries, flagClasses, vertices, n);
  }

  /**
   * Builds a [[https://polytope.miraheze.org/wiki/Simplex | simplex]] with the
   * specified amount of dimensions.
   * Positioned in the standard orientation with edge length 1.
   *
   * @param n The number of dimensions.
   * @return The resulting polytope.
   */
  static simplex(n: number): PolytopeB {
    const vertices: Point[] = [];
    //Memoizes some square roots, tiny optimization.
    const aux: number[] = [Infinity];
    for (let i = 1; i <= n; i++) aux.push(1 / Math.sqrt(2 * i * (i + 1)));

    //Adds vertices.
    for (let i = 0; i <= n; i++) {
      const coordinates: number[] = [];
      for (let j = 1; j <= n; j++) {
        if (j > i) coordinates.push(-aux[j]);
        else if (j === i) coordinates.push(j * aux[j]);
        else coordinates.push(0);
      }
      vertices.push(new Point(coordinates));
    }

    //Adds higher dimensional elements.
    const els: ElementList = [vertices];
    for (let i = 1; i <= n; i++) els.push([]);
    const locations: number[] = [];
    for (let i = 0; i < n + 1; i++) locations[Math.pow(2, i)] = i;
    for (let i = 1; i < Math.pow(2, n + 1); i++) {
      //Vertices were generated earlier
      if (!(i & (i - 1))) continue;
      let elementDimension = -1;
      let t = i;
      const elemVertices: number[] = [];
      do {
        elementDimension++;
        elemVertices.push(t & ~(t - 1));
        t = t & (t - 1);
      } while (t > 0);
      const facets: number[] = [];
      for (let k = 0; k < elemVertices.length; k++)
        facets.push(locations[i ^ elemVertices[k]]);
      locations[i] = els[elementDimension].length;
      (els[elementDimension] as number[][]).push(facets);
    }

    return new PolytopeC(els, new CNSimplex(n));
  }

  /**
   * Builds a [[https://polytope.miraheze.org/wiki/Orthoplex | cross-polytope]]
   * with the specified amount of dimensions.
   * Positioned in the standard orientation with edge length 1.
   *
   * @param n The number of dimensions.
   * @return The resulting polytope.
   */
  static cross(n: number): PolytopeB {
    const symmetries = ConcreteGroup.BC(n);
    const flagClasses: FlagClass[] = [];
    for (let i = 0; i < n; i++) flagClasses.push([[0, [n - (i + 1)]]]);
    const coordinates: number[] = [];
    for (let i = 1; i < n; i++) coordinates.push(0);
    coordinates.push(Math.SQRT1_2);
    const vertices = [new Point(coordinates)];
    return new PolytopeS(symmetries, flagClasses, vertices, n);
  }

  /**
   * Builds a rectified cross-polytope with the specified amount of dimensions.
   * Positioned in the standard orientation with edge length 1.
   *
   * @param n The number of dimensions.
   * @return The resulting polytope.
   */
  static recticross(n: number): PolytopeB {
    const flagClasses: FlagClass[] = [];
    for (let i = 0; i < n; i++) {
      const row: FlagClass = [];
      //i is change, j is flag class
      for (let j = 0; j < n - 1; j++) {
        if (j >= i) row.push([j, [n - (i + 2)]]);
        else if (j === 0 && i === 1) row.push([0, [n - 1]]);
        else if (i === j + 1) row.push([j - 1, []]);
        else if (i === j + 2) row.push([j + 1, []]);
        else row.push([j, [n - (i + 1)]]);
      }
      flagClasses.push(row);
    }
    const coordinates: number[] = [];
    for (let i = 2; i < n; i++) coordinates.push(0);

    coordinates.push(Math.SQRT1_2);
    coordinates.push(Math.SQRT1_2);
    const vertices = [new Point(coordinates)];
    return new PolytopeS(ConcreteGroup.BC(n), flagClasses, vertices, n);
  }

  /**
   * Creates a uniform
   * [[https://polytope.miraheze.org/wiki/Antiprism | antiprism]].
   *
   * @param n The number of sides of the base.
   * @param d The turning number of the base.
   * @return The resulting antiprism.
   * @todo Implement antiprisms of compounds.
   */
  static uniformAntiprism(n: number, d = 1): PolytopeB {
    const x = n / d,
      //Guarantees an unit edge length polytope.
      scale = 2 * Math.sin(Math.PI / x),
      height =
        Math.sqrt((Math.cos(Math.PI / x) - Math.cos((2 * Math.PI) / x)) / 2) /
        scale; //Half of the distance between bases.

    const base1: number[] = [],
      base2: number[] = [],
      newElementList: ElementList = [[], [], [base1, base2], [[]]];

    let i = 0; //The edges in the bases.
    while (i < 2 * (n - 1)) {
      //Vertices.
      newElementList[0].push(
        new Point([
          Math.cos(Math.PI * (i / x)) / scale,
          Math.sin(Math.PI * (i / x)) / scale,
          height,
        ])
      );
      //Equatorial edges, top & bottom edges.
      newElementList[1].push([i, i + 1], [i, i + 2]);
      //Triangular faces.
      newElementList[2].push([2 * i, 2 * i + 1, 2 * i + 2]);
      //Polygonal faces.
      base1.push(2 * i + 1);
      i++;

      //Same thing down here:
      newElementList[0].push(
        new Point([
          Math.cos(Math.PI * (i / x)) / scale,
          Math.sin(Math.PI * (i / x)) / scale,
          -height,
        ])
      );
      newElementList[1].push([i, i + 1]);
      newElementList[1].push([i, i + 2]);
      newElementList[2].push([2 * i, 2 * i + 1, 2 * i + 2]);
      base2.push(2 * i + 1);
      i++;
    }

    //Adds last elements.
    newElementList[0].push(
      new Point([
        Math.cos(Math.PI * (i / x)) / scale,
        Math.sin(Math.PI * (i / x)) / scale,
        height,
      ])
    );
    newElementList[1].push([i, i + 1]);
    newElementList[1].push([i, 0]);
    newElementList[2].push([2 * i, 2 * i + 1, 2 * i + 2]);
    base1.push(2 * i + 1);
    i++;

    newElementList[0].push(
      new Point([
        Math.cos(Math.PI * (i / x)) / scale,
        Math.sin(Math.PI * (i / x)) / scale,
        -height,
      ])
    );
    newElementList[1].push([i, 0], [i, 1]);
    newElementList[2].push([2 * i, 2 * i + 1, 0]);
    base2.push(2 * i + 1);

    //Adds component.
    for (i = 0; i < 2 * (n + 1); i++) newElementList[3][0].push(i);

    //We call PolytopeBuild.regularPolygon(n, d).construction instead of
    //instanciating the CNPolygon directly so that the ConstructionNode has an
    //associated polytope.
    return new PolytopeC(
      newElementList,
      new CNAntiprism(PolytopeBuild.regularPolygon(n, d).construction)
    );
  }

  //Creates an {n / d} cupola with regular faces.
  static cupola(n: number, d: number): PolytopeB {
    if (d === undefined) d = 1;

    const x = n / d,
      //Radius of the smaller base.
      r1 = 1 / (2 * Math.sin(Math.PI / x)),
      //Radius of the larger base.
      r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))),
      //Temporary variable.
      t =
        1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))),
      //Distance between bases.
      h0 = Math.sqrt(1 - t * t),
      //Distance between circumcenter and smaller base.
      h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2,
      //Distance between circumcenter and larger base.
      h2 = h1 - h0;

    //The cupola's bases.
    const base1: number[] = [],
      base2: number[] = [],
      //List of elements of the cupola.
      newElementList: ElementList = [[], [], [base1, base2], [[]]];

    let i: number;
    for (i = 0; i < n - 1; i++) {
      //Small base's vertices.
      newElementList[0].push(
        new Point([
          r1 * Math.cos(2 * Math.PI * (i / x)),
          r1 * Math.sin(2 * Math.PI * (i / x)),
          h1,
        ])
      );
      //Small base's edges.
      newElementList[1].push([i, i + 1]);
      //Connecting edges.
      newElementList[1].push([i, n + 2 * i]);
      newElementList[1].push([i, n + 2 * i + 1]);
      //Triangles.
      newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + 2 * i]);
      //Squares.
      newElementList[2].push([3 * i + 2, 3 * n + 2 * i + 1, 3 * i + 4, 3 * i]);
      //Small base.
      base1.push(3 * i);
    }

    //Adds last elements.
    newElementList[0].push(
      new Point([
        r1 * Math.cos(2 * Math.PI * (i / x)),
        r1 * Math.sin(2 * Math.PI * (i / x)),
        h1,
      ])
    );
    newElementList[1].push([i, 0]);
    newElementList[1].push([i, n + 2 * i]);
    newElementList[1].push([i, n + 2 * i + 1]);
    newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + 2 * i]);
    newElementList[2].push([3 * i + 2, 3 * n + 2 * i + 1, 1, 3 * i]);
    base1.push(3 * i);

    for (i = 0; i < 2 * n - 1; i++) {
      //Big base's vertices.
      newElementList[0].push(
        new Point([
          r2 * Math.cos(Math.PI * ((i - 0.5) / x)),
          r2 * Math.sin(Math.PI * ((i - 0.5) / x)),
          h2,
        ])
      );
      //Big base's edges.
      newElementList[1].push([n + i, n + i + 1]);
      //Big base.
      base2.push(3 * n + i);
    }
    //Adds last elements.
    newElementList[0].push(
      new Point([
        r2 * Math.cos(Math.PI * ((i - 0.5) / x)),
        r2 * Math.sin(Math.PI * ((i - 0.5) / x)),
        h2,
      ])
    );
    newElementList[1].push([n + i, n]);
    base2.push(3 * n + i);

    for (i = 0; i < 2 * n + 2; i++) newElementList[3][0].push(i);

    //We call PolytopeBuild.regularPolygon(n, d).construction instead of
    //instanciating the CNPolygon directly so that the ConstructionNode has an
    //associated polytope.
    return new PolytopeC(
      newElementList,
      new CNCupola(PolytopeBuild.regularPolygon(n, d).construction)
    );
  }

  //Creates an {n / d} cuploid with regular faces.
  static cuploid(n: number, d: number): PolytopeB {
    if (d === undefined) d = 1;
    const x = n / d,
      //Radius of the smaller base.
      r1 = 1 / (2 * Math.sin(Math.PI / x)),
      //Radius of the larger base.
      r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))),
      //Temporary variable.
      t =
        1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))),
      //Distance between bases.
      h0 = Math.sqrt(1 - t * t),
      //Distance between circumcenter and smaller base.
      h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2,
      //Distance between circumcenter and larger base.
      h2 = h1 - h0;

    //The base of the cupola.
    const base: number[] = [],
      //List of elements of the cupola.
      newElementList: ElementList = [[], [], [base], [[]]];

    let i: number;
    for (i = 0; i < n - 1; i++) {
      //Small base's vertices.
      newElementList[0].push(
        new Point([
          r1 * Math.cos(2 * Math.PI * (i / x)),
          r1 * Math.sin(2 * Math.PI * (i / x)),
          h1,
        ])
      );
      //Small base's edges.
      newElementList[1].push([i, i + 1]);
      //Connecting edges.
      newElementList[1].push([i, n + ((2 * i) % n)]);
      newElementList[1].push([i, n + ((2 * i + 1) % n)]);
      //Triangles.
      newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + ((2 * i) % n)]);
      //Squares.
      newElementList[2].push([
        3 * i + 2,
        3 * n + ((2 * i + 1) % n),
        3 * i + 4,
        3 * i,
      ]);
      //Small base.
      base.push(3 * i);
    }

    //Adds last elements.
    newElementList[0].push(
      new Point([
        r1 * Math.cos(2 * Math.PI * (i / x)),
        r1 * Math.sin(2 * Math.PI * (i / x)),
        h1,
      ])
    );
    newElementList[1].push([i, 0]);
    newElementList[1].push([i, 2 * i]);
    newElementList[1].push([i, 2 * i + 1]);
    newElementList[2].push([3 * i + 1, 3 * i + 2, 2 * n + 2 * i]);
    newElementList[2].push([3 * i + 2, 2 * n + 2 * i + 1, 1, 3 * i]);
    base.push(3 * i);

    for (i = 0; i < n - 1; i++) {
      //Big base's vertices.
      newElementList[0].push(
        new Point([
          r2 * Math.cos(Math.PI * ((i - 0.5) / x)),
          r2 * Math.sin(Math.PI * ((i - 0.5) / x)),
          h2,
        ])
      );
      //Big base's edges.
      newElementList[1].push([n + i, n + i + 1]);
    }
    //Adds last elements.
    newElementList[0].push(
      new Point([
        r2 * Math.cos(Math.PI * ((i - 0.5) / x)),
        r2 * Math.sin(Math.PI * ((i - 0.5) / x)),
        h2,
      ])
    );
    newElementList[1].push([n + i, n]);

    for (i = 0; i < 2 * n + 1; i++) newElementList[3][0].push(i);

    //We call PolytopeBuild.regularPolygon(n, d).construction instead of
    //instanciating the CNPolygon directly so that the ConstructionNode has an
    //associated polytope.
    return new PolytopeC(
      newElementList,
      new CNCuploid(PolytopeBuild.regularPolygon(n, d).construction)
    );
  }

  //Creates an {n / d} cupolaic blend with regular faces.
  static cupolaicBlend(n: number, d: number): PolytopeB {
    if (d === undefined) d = 1;

    const x = n / d,
      r1 = 1 / (2 * Math.sin(Math.PI / x)), //Radius of the smaller base.
      r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))), //Radius of the larger base.
      //Temporary variable.
      t =
        1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))),
      //Distance between bases.
      h0 = Math.sqrt(1 - t * t),
      //Distance between circumcenter and smaller base.
      h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2,
      //Distance between circumcenter and larger base.
      h2 = h1 - h0;

    //The bases of the cupola.
    const base1: number[] = [],
      base2: number[] = [],
      //List of elements of the cupola.
      newElementList: ElementList = [[], [], [base1, base2], [[]]];

    let even = true;

    let i: number;
    for (i = 0; i < 2 * (n - 1); i++) {
      //Small bases' vertices.
      newElementList[0].push(
        new Point([
          r1 * Math.cos(Math.PI * (i / x)),
          r1 * Math.sin(Math.PI * (i / x)),
          h1,
        ])
      );
      //Small bases' edges.
      newElementList[1].push([i, i + 2]);
      //Connecting edges.
      newElementList[1].push([i, 2 * n + i]);
      newElementList[1].push([i, 2 * n + i + 1]);
      //Triangles.
      newElementList[2].push([3 * i + 1, 3 * i + 2, 6 * n + i]);
      //Squares.
      newElementList[2].push([3 * i + 2, 6 * n + i + 1, 3 * i + 7, 3 * i]);
      //Small base.
      if (even) base1.push(3 * i);
      else base2.push(3 * i);
      even = !even;
    }

    //Adds last elements.
    newElementList[0].push(
      new Point([
        r1 * Math.cos(Math.PI * (i / x)),
        r1 * Math.sin(Math.PI * (i / x)),
        h1,
      ])
    );
    newElementList[1].push([i, 0]);
    newElementList[1].push([i, 2 * n + i]);
    newElementList[1].push([i, 2 * n + i + 1]);
    newElementList[2].push([3 * i + 1, 3 * i + 2, 6 * n + i]);
    newElementList[2].push([3 * i + 2, 6 * n + i + 1, 1, 3 * i]);
    base1.push(3 * i);
    i++;

    newElementList[0].push(
      new Point([
        r1 * Math.cos(Math.PI * (i / x)),
        r1 * Math.sin(Math.PI * (i / x)),
        h1,
      ])
    );
    newElementList[1].push([i, 1]);
    newElementList[1].push([i, 2 * n + i]);
    newElementList[1].push([i, 2 * n]);
    newElementList[2].push([3 * i + 1, 3 * i + 2, 6 * n + i]);
    newElementList[2].push([3 * i + 2, 6 * n, 4, 3 * i]);
    base2.push(3 * i);

    for (i = 0; i < 2 * n - 1; i++) {
      //Big base's vertices.
      newElementList[0].push(
        new Point([
          r2 * Math.cos(Math.PI * ((i - 0.5) / x)),
          r2 * Math.sin(Math.PI * ((i - 0.5) / x)),
          h2,
        ])
      );
      //Big base's edges.
      newElementList[1].push([2 * n + i, 2 * n + i + 1]);
    }
    //Adds last elements.
    newElementList[0].push(
      new Point([
        r2 * Math.cos(Math.PI * ((i - 0.5) / x)),
        r2 * Math.sin(Math.PI * ((i - 0.5) / x)),
        h2,
      ])
    );
    newElementList[1].push([2 * n + i, 2 * n]);

    for (i = 0; i < 2 * n + 1; i++) newElementList[3][0].push(i);

    //We call PolytopeBuild.regularPolygon(n, d).construction instead of
    //instanciating the CNPolygon directly so that the ConstructionNode has an
    //associated polytope.
    return new PolytopeC(
      newElementList,
      new CNCupolaicBlend(PolytopeBuild.regularPolygon(n, d).construction)
    );
  }
}

/**
 * Extrudes a polytope into a pyramid.
 * @param	apex The apex of the pyramid, or its height.
 * @returns The resulting pyramid.
 */
PolytopeB.prototype.extrudeToPyramid = function (
  apex: Point | number
): PolytopeB {
  const P = this.toPolytopeC();
  if (!P.elementList[0]) return new PolytopeC([[new Point([])]]);

  let els: number[], i: number;

  //If the height was passed instead, builds a point from there.
  if (typeof apex === "number") {
    const newApex: number[] = [];
    for (let i = 0; i < P.dimensions; i++) newApex.push(0);
    newApex.push(apex);
    apex = new Point(newApex);
  }

  P.dimensions++;
  (P.elementList as number[][][]).push([]);

  const oldElNumbers: number[] = [];
  for (i = 0; i <= P.dimensions; i++)
    oldElNumbers.push(P.elementList[i].length);

  //Adds apex.
  P.elementList[0].push(apex);
  P.setSpaceDimensions(Math.max(apex.dimensions(), P.spaceDimensions));

  //Adds edges.
  if (P.elementList[1]) {
    for (i = 0; i < oldElNumbers[0]; i++)
      P.elementList[1].push([i, oldElNumbers[0]]);
  }

  //Adds remaining elements.
  for (let d = 2; d <= P.dimensions; d++) {
    for (i = 0; i < oldElNumbers[d - 1]; i++) {
      els = [i];
      for (let j = 0; j < (P.elementList[d - 1] as number[][])[i].length; j++)
        els.push(P.elementList[d - 1][i][j] + oldElNumbers[d - 1]);
      (P.elementList[d] as number[][]).push(els);
    }
  }

  const construction = new CNPyramid(P.construction);
  P.setConstruction(construction);
  return P;
};
