Miratope has a complex built-in system to generate the names of many polytopes automatically. This makes translating Miratope quite more difficult than simply translating a set of messages. The following guide will help you contribute to making Miratope accessible for international users, by outlining how Miratope's translation system works, and explaining how to build upon it or modify it.

## The [`ConstructionNode`](ConstructionNode.html) class

To understand how Miratope generates the name for a constructed polytope, we need to start from the `ConstructionNode` class. Every time you call a function such as [`Polytope.regularPolygon`](Polytope.html#regularPolygon), [`Polytope.prismProduct`](Polytope.html#prismProduct), or the other many functions that programatically generate polytopes, Miratope generates a ConstructionNode that encodes how the polytope was built up. ConstructionNodes have two main properties: the `type` property, which is a [`ConstructionNodeType`](ConstructionNodeType.html) specifying what type of step was undertaken in its construction, and a `children` property, which specifies certain parameters about this step. The exact format of the `children` property is dependent on the ConstructionNode's type. For instance, consider the following polytope:

```javascript
var P = Polytope.tegumProduct(Polytope.simplex(3), Polytope.regularPolygon(5, 2));
```

If we call `P.construction`, which stores this construction, we'll be able to retrieve the ConstructionNode associated to `P`, which will look something like this:

```javascript
{
	type: ConstructionNodeType.Multitegum,
	children:
	[
		{
			type: ConstructionNodeType.Simplex,
			children: 3
		},		
		{
			type: ConstructionNodeType.Polygon,
			children: [5, 2]
		}
	]
}
```

This is the information that Miratope will use to generate and translate the polytope's name.

## The [`ConstructionNode.prototype.getName`](ConstructionNode.html#getName) function

To get the name of a polytope in any language, one can call the [`Polytope.prototype.getName`](Polytope.html#getName) function, which internally calls the [`ConstructionNode.prototype.getName`](ConstructionNode.html#getName) function on the polytope's construction. Depending on the ConstructionNode's type, the task of actually assigning the name will be delegated to other functions.