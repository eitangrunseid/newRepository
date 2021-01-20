'use strict'


function createMat(size) {
  var rows = size, cols = size;
  var mat = [];
  for (var i = 0; i < rows; i++) {
    mat[i] = [];
    for (var j = 0; j < cols; j++) {
      mat[i][j] = '';
    }
  }

  return mat;
}

