/** An enumeration containing the possible types of [[`ConstructionNode`]]s. */
enum Type {
  /**
   * The corresponding ConstructionNode has two children `[n, d]`,
   * representing the number of facets `n`
   * and the number of dimensions `d` of the polytope.
   * Its name is generated by [[`plain`]].
   */
  Plain,

  /**
   * The corresponding ConstructionNode has two children `[n, d]`, representing
   * the regular polygon {n/d}.
   * Its name is generated by [[`regularPolygonName`]].
   */
  Polygon,

  /**
   * The corresponding ConstructionNode has an array with the factors of a prism
   * product as children.
   * Its name is generated by [[`multiFamily`]].
   */
  Multiprism,

  /**
   * The corresponding ConstructionNode has an array with the factors of a tegum
   * product as children.
   * Its name is generated by [[`multiFamily`]].
   */
  Multitegum,

  /**
   * The corresponding ConstructionNode has an array with the factors of a
   * pyramid product as children.
   * Its name is generated by [[`multiFamily`]].
   */
  Multipyramid,

  /**
   * The corresponding ConstructionNode has a single child representing the
   * antiprismatic base.
   * Its name is generated by [[`familyMember`]].
   */
  Antiprism,

  /**
   * The corresponding ConstructionNode has a single child representing the
   * cupoidal base.
   * Its name is generated by [[`familyMember`]].
   */
  Cupola,

  /**
   * The corresponding ConstructionNode has a single child representing the
   * cuploidal base.
   * Its name is generated by [[`familyMember`]].
   */
  Cuploid,

  /**
   * The corresponding ConstructionNode has a single child representing the
   * cupolaic blend base.
   * Its name is generated by [[`familyMember`]].
   */
  CupolaicBlend,

  /**
   * The corresponding ConstructionNode has a polytope's "code name" as a child.
   * Used for polytopes whose names are in loadMessages.js.
   * Can be translated.
   * Its name is generated by [[`Translation.get`]].
   */
  Codename,

  /**
   * The corresponding ConstructionNode has a polytope's name as a child.
   * The default for imported polytopes,
   * or polytopes not built out of anything else whose name is known.
   * Can **not** be translated.
   * Its name is just the ConstructionNode's child itslf.
   */
  Name,

  /**
   * The corresponding ConstructionNode has the dimension of a hypercube as a
   * child.
   * Its name is generated by [[`Naming.hypercube`]].
   */
  Hypercube,

  /**
   * The corresponding ConstructionNode has the dimension of a simplex as a
   * child.
   * Its name is generated by [[`Naming.simplex`]].
   */
  Simplex,

  /**
   * The corresponding ConstructionNode has the dimension of an orthoplex as a
   * child.
   * Its name is generated by [[`Naming.cross`]].
   */
  Cross,
}

export default Type;
