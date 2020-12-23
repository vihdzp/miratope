import { PolytopeBuild } from "./polytopeBuild";
import { PolytopeCD } from "./polytopeCD";
import { PolytopeProduct } from "./polytopeProduct";
import { FileOperations } from "../../file operations/fileOperations";
import "../../file operations/off";
import "../../file operations/ggb";

globalThis.Build = PolytopeBuild;
globalThis.CD = PolytopeCD;
globalThis.Product = PolytopeProduct;
globalThis.Library = FileOperations;
