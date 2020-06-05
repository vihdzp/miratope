//A node, for usage in a doubly linked list
//Each DLLNode is linked to two other nodes: linkage should be reflexive.
//However, DLLNodes don't have a notion of a "previous" and a "next" node by themselves.
class DLLNode {
	constructor(value, node1, node2) {
		this.value = value;
		this.node1 = node1;
		this.node2 = node2;
	}
	
	linkTo(node) {
		//Links this to node.
		if(this.node1 === undefined)
			this.node1 = node;
		else if(this.node2 === undefined)
			this.node2 = node;
		else
			throw new Error("A DLLNode can only be linked to two other nodes!");
		
		//Links node to this.
		if(node.node1 === undefined)
			node.node1 = this;
		else if(node.node2 === undefined)
			node.node2 = this;
		else
			throw new Error("A DLLNode can only be linked to two other nodes!");
	}
	
	//Traverses all nodes, while avoiding backtracking.
	getCycle() {
		var cycle = [this.value];
		var prevNode = this;
		var node = this.node1;
		
		while(node !== this) {
			cycle.push(node.value);
			if(node.node1 !== prevNode){				
				prevNode = node;
				node = node.node1;
			}
			else{				
				prevNode = node;
				node = node.node2;
			}
		}
		
		return cycle;
	}
}

//A node, for usage in a linked list
//Each LLNode is linked to exactly one other node.
class LLNode {
	constructor(value, node) {
		this.value = value;
		this.node = node;
		this.traversed = false;
	}
	
	linkTo(node) {
		this.node = node;
	}
	
	//Traverses all nodes.
	getCycle() {
		var cycle = [this.value];
		var node = this.node;
		this.traversed = true;
		
		while(!node.traversed) {
			cycle.push(node.value);
			node.traversed = true;
			node = node.node;
		}
		
		return cycle;
	}
}