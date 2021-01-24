import Type from "./Type";
import { Language } from "../../Translation/Language";
import * as Message from "../../Translation/Basic/Message";

import { Gender } from "../../Translation/Basic/LanguageOptions";
import type { PolytopeB } from "../../polytopes/types";

export default abstract class ConstructionNode<T> {
  /** The type of ConstructionNode. */
  abstract readonly type: Type;

  /** The "child" of the node, stores information about the construction of a
   * polytope. The exact information it stores depends on the [[`type`]]. */
  abstract child: T;

  abstract polytope: PolytopeB | undefined;
  abstract gender: Gender;

  /** Returns the name of the polytope represented by the `ConstructionNode`.
   */
  abstract getName(): string;

  /** Assigns a given gender to itself and to its children, whenever the
   * children are ConstructionNodes too. */
  abstract setGenders(gender: Gender): void;

  /**
   * Converts a ConstructionNode into the corresponding member of the specified
   * family's name.
   *
   * @param family The code for the family's name.
   * @param gender The grammatical gender of the resulting expression.
   *
   * @example
   * const cube = new Hypercube(3);
   *
   * //Cubic pyramid.
   * console.log(cube.familyMember("family/pyramid"));
   */
  familyMember(family: string): string {
    return Language.addAdjective(
      Language.toAdjective(this.getName(), this.gender),
      Message.get(family)
    );
  }
}

/**
 * Converts a set of ConstructionNodes into their
 * prism product/tegum product/pyramid product's name.
 *
 * @param nodes The array of nodes to convert.
 * @param family The prodct used (i.e. `"prism"`, `"tegum"` or `"pyramid"`).
 * @param specialFactor An element such that, when it appears in the product,
 * is considered differently.
 * @param specialFactorModify Specifies what `specialFactor` becomes into
 * within the product.
 * @returns The resulting name.
 *
 * @example
 * const triangle = new Polygon([3, 1]);
 * const pentagram = new Polygon([5, 2]);
 *
 * //Triangular-pentagrammic duoprism.
 * console.log(ConstructionNode.multiFamily(
 *     [triangle, pentagram],
 *     "family/multiprism",
 *     "shape/dyad",
 *     "shape/prism"
 * ));
 */
const multiFamily = function (
  nodes: ConstructionNode<unknown>[],
  family: string,
  specialFactor: string,
  specialFactorModify: string,
  gender: Gender
): string {
  const names: string[] = [];
  const FAMILY = Message.get(family);
  const FAMILYADJ = Language.toAdjective(FAMILY, gender);
  const SPECIAL = Message.get(specialFactor);
  const SPECIALMOD = Message.get(specialFactorModify);
  const SPECIALMODADJ = Language.toAdjective(SPECIALMOD, gender);
  let specialCount = 0;
  let tempName: string;
  let concatName: string;
  let allNameSame = true;

  // Counts special factors.
  for (let i = 0; i < nodes.length; i++) {
    tempName = nodes[i].getName();
    if (tempName === SPECIAL) specialCount++;
    else names.push(tempName);
  }

  // The prefix before [family], e.g. *duo*[family], *trio*[family], ...
  let prefix: string;
  switch (names.length) {
    // All special factors.
    case 0:
      names.push(SPECIAL);
      specialCount--;
      prefix = "";
      break;
    case 1:
      prefix = "";
      break;
    case 2:
      prefix = "duo";
      break;
    case 3:
      prefix = "trio";
      break;
    default:
      prefix = Language.greekPrefix(names.length);
      break;
  }

  // names cannot be empty.
  tempName = names.pop() as string;
  concatName = Language.toAdjective(tempName, gender);

  while (names.length > 0) {
    concatName += "-" + Language.toAdjective(names[names.length - 1], gender);
    if (names.pop() !== tempName) allNameSame = false;
  }

  if (!specialCount) {
    // X multi[family]
    if (allNameSame) {
      return Language.addAdjective(
        Language.toAdjective(tempName, gender),
        prefix + FAMILY
      );
    }

    // X-Y-Z multi[family]
    return Language.addAdjective(concatName, prefix + FAMILY);
  }

  // Same as before, but adds as many ...[family-adj] [family] as needed at
  // the end.
  if (allNameSame) concatName = Language.toAdjective(tempName, gender);

  // We aren't calling a single polytope X an "X mono[family]", are we?
  if (prefix)
    concatName = Language.addAdjective(concatName, prefix + FAMILYADJ);

  while (--specialCount)
    concatName = Language.addAdjective(concatName, SPECIALMODADJ);

  return Language.addAdjective(concatName, SPECIALMOD);
};

export abstract class Leaf<T> extends ConstructionNode<T> {
  abstract readonly type: Type;
  abstract child: T;
  abstract polytope: PolytopeB | undefined;
  abstract gender: Gender;
  abstract getName(): string;

  setGenders(gender: Gender): void {
    this.gender = gender;
  }
}

export abstract class Family extends ConstructionNode<
  ConstructionNode<unknown>
> {
  abstract readonly type: Type;
  abstract child: ConstructionNode<unknown>;
  abstract polytope: PolytopeB | undefined;
  abstract gender: Gender;

  abstract family: string;

  getName(): string {
    return this.child.familyMember("family/" + this.family);
  }

  setGenders(gender: Gender): void {
    this.gender = gender;
    this.child.setGenders(gender);
  }
}

export abstract class Multifamily extends ConstructionNode<
  ConstructionNode<unknown>[]
> {
  abstract readonly type: Type;
  abstract child: ConstructionNode<unknown>[];
  abstract polytope: PolytopeB | undefined;
  abstract gender: Gender;

  abstract family: string;
  abstract specialFactor: string;
  abstract specialFactorModify: string;

  getName(): string {
    this.mergeChildren();
    return multiFamily(
      this.child,
      "family/" + this.family,
      "shape/" + this.specialFactor,
      "family/" + this.specialFactorModify,
      this.gender
    );
  }

  setGenders(gender: Gender): void {
    this.gender = gender;
    for (let i = 0; i < this.child.length; i++)
      this.child[i].setGenders(gender);
  }

  /**
   * A multiprism of multiprisms is just a larger multiprism,
   * a multitegum of multitegums is just a larger multitegum, etc.
   * This function removes children nodes of the same type
   * and replaces them by their children.
   */
  mergeChildren(): void {
    const oldLength = this.child.length;

    // For each of the array's members:
    for (let i = 0; i < oldLength; i++) {
      const child = this.child[i];

      // If the child is of the same type of construction node:
      if (child.type === this.type && child instanceof Multifamily) {
        const grandchild = child.child;

        // Flatten the children array.
        let j: number;
        for (j = 0; j < grandchild.length - 1; j++)
          this.child.push(grandchild[j]);

        this.child[i] = grandchild[j];
      }
    }
  }
}
