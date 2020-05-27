class Sorts {
	//Quicksort, adapted from https://en.wikipedia.org/wiki/Quicksort#Lomuto%20partition%20scheme
	static quickSort(array, lo, hi, compareFunction) {
		if(compareFunction === undefined)
			compareFunction = function(a, b){return a - b;};
		if(lo < hi) {
			var p = Sorts.partition(array, lo, hi, compareFunction);
			Sorts.quickSort(array, lo, p - 1, compareFunction);
			Sorts.quickSort(array, p + 1, hi, compareFunction);
		}
	}
	
	static partition(array, lo, hi, compareFunction) {
		var pivot = array[hi];
		var i = lo;
		for (var j = lo; j <= hi; j++) {
			if (compareFunction(array[j], pivot) < 0) {
				Sorts.swap(array, i, j);
				i++;
			}
		}
		Sorts.swap(array, i, hi);
		return i;
	}
	
	static swap(array, i, j) {
		var temp = array[j];
		array[i] = array[j];
		array[j] = temp;
	}
}