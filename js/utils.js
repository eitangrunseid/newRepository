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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min)
}


function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}
