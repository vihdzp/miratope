class Sorts {
	//Quicksort, adapted from https://en.wikipedia.org/wiki/Quicksort#Lomuto%20partition%20scheme
	static quicksort(array, lo, hi) {
		if(lo < hi) {
			var p = partition(attay, lo, hi);
			quicksort(A, lo, p - 1);
			quicksort(A, p + 1, hi);
		}
	}
	
	static partition(array, lo, hi) {
		var pivot = A[hi];
		var i = lo;
		for (var j = lo; j <= hi; j++) {
			if (A[j] < pivot) {
				swap(array, i, j);
				i++;
			}
		}
		swap(array, i, hi);
		return i;
	}
	
	static swap(array, i, j) {
		var temp = array[j];
		array[i] = array[j];
		array[j] = temp;
	}
}