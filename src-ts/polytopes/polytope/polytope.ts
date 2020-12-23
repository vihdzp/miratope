import { PolytopeBuild } from "./polytopeBuild";
import { PolytopeCD } from "./polytopeCD";
import { PolytopeProduct } from "./polytopeProduct";

export abstract class Polytope {
  static Build: PolytopeBuild = PolytopeBuild;
  static CD: PolytopeCD = PolytopeCD;
  static Product: PolytopeProduct = PolytopeProduct;
}
