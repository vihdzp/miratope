/**
 * Exposes the various polytope classes to the global namespace.
 * @packageDocumentation
 */

import Build from "./Build";
import CD from "./CD";
import Product from "./Product";
import Library from "../../files/Library";
import "../../files/OFF";
import "../../files/GGB";

//Exposes the internal classes.
globalThis.Build = Build;
globalThis.CD = CD;
globalThis.Product = Product;
globalThis.Library = Library;
