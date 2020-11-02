Miratope has been built off on the shoulders of many open-source projects. Ideally, all of these dependencies should be kept up to date, at their latest release build, to ensure their best functionality. However, some of these dependencies have been modified, and directly replacing them may break the code. We present a detailed guide explaining whether and how each dependency should be updated.

## [avl-tree.js](data structures_avl-tree.js.html)

The core AvlTree class was written by Daniel Imms, and is hosted here. Nevertheless, much of that core functionality has been heavily modified or removed: namely, the parent attribute was added to nodes, the next() and prev() functions were implemented, and the value attribute was removed from nodes. As such, Miratope’s AvlTree class is incompatible with the one on the repository, and should not be updated.

## [jszip.js](importing_jszip.js.html)

The JSZip class was written by Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso, and is hosted here. It has been included unmodified in Miratope. It should be updated without modification, preferably by the unminified version, in case the need to edit the class arises.

## [three.js](rendering_three.js.html)

The THREE class was written by the three.js authors, and is hosted here. A single line has been added, namely line XXX, for convenience in the renderPolygon (what’s it called?) function. It should be updated, with the line added back in place. 

## [qhull.js](qhull_qhull.js.html)

Qhull was originally written by X. In 2013, it was ported into JavaScript by Y, using