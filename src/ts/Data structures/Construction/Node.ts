import * as Message from "../../Translation/Basic/Message";
import { Language } from "../../Translation/Language";
import Type from "./Type";
import { Gender } from "../../Translation/Basic/LanguageOptions";
import type { PolytopeB } from "../../polytopes/types";
import ConstructionNode, { Leaf, Family, Multifamily } from "./base";

/**
 * A ConstructionNode of [[`Plain`]] type.
 *
 * @category ConstructionNode Types
 */
export class Plain extends Leaf<[number, number]> {
  readonly type = Type.Plain;
  child: [number, number];
  polytope: PolytopeB | undefined;
  gender: Gender;

  constructor(child: [number, number]) {
    super();
    this.child = child;
    this.gender = Language.plainGender(...child);
  }

  getName(): string {
    return Language.plain(...this.child, {
      gender: this.gender,
    });
  }
}

/**
 * A ConstructionNode of [[`Polygon`]] type.
 *
 * @category ConstructionNode Types
 */
export class Polygon extends Leaf<[number, number]> {
  readonly type = Type.Polygon;
  child: [number, number];
  polytope: PolytopeB | undefined;
  gender: Gender;

  constructor(child: [number, number]) {
    super();
    this.child = child;
    this.gender = Language.polygonGender(...child);
  }

  getName(): string {
    return Language.regularPolygon(...this.child, {
      gender: this.gender,
    });
  }
}

/**
 * A ConstructionNode of [[`Multiprism`]] type.
 *
 * @category ConstructionNode Types
 */
export class Multiprism extends Multifamily {
  readonly type = Type.Multiprism;
  child: ConstructionNode<unknown>[];
  polytope: PolytopeB | undefined;
  gender: Gender;

  family = "prism";
  specialFactor = "dyad";
  specialFactorModify = "prism";

  constructor(child: ConstructionNode<unknown>[]) {
    super();
    this.child = child;
    this.gender = Language.multiprismGender(child.length);
  }
}

/**
 * A ConstructionNode of [[`Multitegum`]] type.
 *
 * @category ConstructionNode Types
 */
export class Multitegum extends Multifamily {
  readonly type = Type.Multitegum;
  child: ConstructionNode<unknown>[];
  polytope: PolytopeB | undefined;
  gender: Gender;

  family = "tegum";
  specialFactor = "dyad";
  specialFactorModify = "bipyramid";

  constructor(child: ConstructionNode<unknown>[]) {
    super();
    this.child = child;
    this.gender = Language.multitegumGender(child.length);
  }
}

/**
 * A ConstructionNode of [[`Multipyramid`]] type.
 *
 * @category ConstructionNode Types
 */
export class Multipyramid extends Multifamily {
  readonly type = Type.Multipyramid;
  child: ConstructionNode<unknown>[];
  polytope: PolytopeB | undefined;
  gender: Gender;

  family = "pyramid";
  specialFactor = "point";
  specialFactorModify = "pyramid";

  constructor(child: ConstructionNode<unknown>[]) {
    super();
    this.child = child;
    this.gender = Language.multipyramidGender(child.length);
  }
}

/**
 * A ConstructionNode of [[`Antiprism`]] type.
 *
 * @category ConstructionNode Types
 */
export class Antiprism extends Family {
  readonly type = Type.Antiprism;
  child: ConstructionNode<unknown>;
  polytope: PolytopeB | undefined;
  gender: Gender;

  family = "antiprism";

  constructor(child: ConstructionNode<unknown>) {
    super();
    this.child = child;
    this.gender = Language.antiprismGender();
  }
}

/**
 * A ConstructionNode of [[`Cupola`]] type.
 *
 * @category ConstructionNode Types
 */
export class Cupola extends Family {
  readonly type = Type.Cupola;
  child: ConstructionNode<unknown>;
  polytope: PolytopeB | undefined;
  gender: Gender;

  family = "cupola";

  constructor(child: ConstructionNode<unknown>) {
    super();
    this.child = child;
    this.gender = Language.cupolaGender();
  }
}

/**
 * A ConstructionNode of [[`Cuploid`]] type.
 *
 * @category ConstructionNode Types
 */
export class Cuploid extends Family {
  readonly type = Type.Cuploid;
  child: ConstructionNode<unknown>;
  polytope: PolytopeB | undefined;
  gender: Gender;

  family = "cuploid";

  constructor(child: ConstructionNode<unknown>) {
    super();
    this.child = child;
    this.gender = Language.cuploidGender();
  }
}

/**
 * A ConstructionNode of [[`CupolaicBlend`]] type.
 *
 * @category ConstructionNode Types
 */
export class CupolaicBlend extends Family {
  readonly type = Type.CupolaicBlend;
  child: ConstructionNode<unknown>;
  polytope: PolytopeB | undefined;
  gender: Gender;

  family = "cupolaicBlend";

  constructor(child: ConstructionNode<unknown>) {
    super();
    this.child = child;
    this.gender = Language.cupolaicBlendGender();
  }
}

/**
 * A ConstructionNode of [[`Codename`]] type.
 *
 * @category ConstructionNode Types
 */
export class Codename extends Leaf<string> {
  readonly type = Type.Codename;
  child: string;
  polytope: PolytopeB | undefined;
  gender: Gender;

  constructor(child: string) {
    super();
    this.child = child;
    this.gender = Gender.male;
  }

  getName(): string {
    return Message.get("shape/" + this.child, { gender: this.gender });
  }
}

/**
 * A ConstructionNode of [[`Name`]] type.
 *
 * @category ConstructionNode Types
 */
export class Name extends Leaf<string> {
  readonly type = Type.Codename;
  child: string;
  polytope: PolytopeB | undefined;
  gender: Gender;

  constructor(child: string) {
    super();
    this.child = child;
    this.gender = Gender.male;
  }

  getName(): string {
    return this.child;
  }
}

/**
 * A ConstructionNode of [[`Hypercube`]] type.
 *
 * @category ConstructionNode Types
 */
export class Hypercube extends Leaf<number> {
  readonly type = Type.Hypercube;
  child: number;
  polytope: PolytopeB | undefined;
  gender: Gender;

  constructor(child: number) {
    super();
    this.child = child;
    this.gender = Language.hypercubeGender(child);
  }

  getName(): string {
    return Language.hypercube(this.child);
  }
}

/**
 * A ConstructionNode of [[`Simplex`]] type.
 *
 * @category ConstructionNode Types
 */
export class Simplex extends Leaf<number> {
  readonly type = Type.Simplex;
  child: number;
  polytope: PolytopeB | undefined;
  gender: Gender;

  constructor(child: number) {
    super();
    this.child = child;
    this.gender = Language.simplexGender(child);
  }

  getName(): string {
    return Language.simplex(this.child);
  }
}

/**
 * A ConstructionNode of [[`Cross`]] type.
 *
 * @category ConstructionNode Types
 */
export class Cross extends Leaf<number> {
  readonly type = Type.Cross;
  child: number;
  polytope: PolytopeB | undefined;
  gender: Gender;

  constructor(child: number) {
    super();
    this.child = child;
    this.gender = Language.crossGender(child);
  }

  getName(): string {
    return Language.cross(this.child);
  }
}
