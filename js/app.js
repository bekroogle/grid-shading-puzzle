var gridData, rowLabels, colLabels;
var killClick = false;

$(document).ready( function() {
$.event.special.tap.emitTapOnTaphold = false;

  var loadGrid = function() {
    $.get('data/starting-grid.dat', function(file) {
      var rows = (file.split(/\n\r?/));
      for (var i in rows) {
        rows[i] = rows[i].split(' ');
        for (var j in rows[i]) {
          rows[i][j] = parseInt(rows[i][j]);
        }
      }

      gridData = JSON.parse(localStorage.getItem('gridData')) || rows.splice(0,25);
      drawGrid();
      loadLabels();
      createListeners();

    });
  };

  var loadLabels = function() {
    $.get('data/row-labels.dat', function(data) {
      rowLabels = data.split(/\n\r?/);
      for (var row in rowLabels) {
        rowLabels[row] = rowLabels[row].split(' ');
        for (var elem in rowLabels[row]) {
          rowLabels[row][elem] = parseInt(rowLabels[row][elem]);
        }
      }
      rowLabels = rowLabels.splice(0,25);
      $.get('data/column-labels.dat', function(data) {
        colLabels = data.split(/\n\r?/);
        for (var col in colLabels) {
          colLabels[col] = colLabels[col].split(' ');
          for (var elem in colLabels[col]) {
            colLabels[col][elem] = parseInt(colLabels[col][elem]);
          }
        }
        colLabels = colLabels.splice(0,25);
        updateSequences();
      });

    });
  }

  var countGridSequences = function(gridData) {
    var gridSequences = [];
    for (var row in gridData) {
      gridSequences.push(countRowSequences(gridData[row]));
    }
    return gridSequences;
  }

  var transposeGrid = function(grid) {
    var tGrid = [];
    for (var i = 0; i < grid[0].length; i++) {
      tGrid.push([]);
      for (var row in grid) {
        tGrid[i].push(grid[row][i]);
      }
    }
    return tGrid;
  };

  var countRowSequences = function(rowData) {
     var countVal = 0;
     var seq = [];
     for (var i in rowData) {

       if (rowData[i] % 2 === 1) {
         countVal ++;
       } else {
         if (countVal > 0) {
           seq.push(countVal);
         }

         countVal = 0;
       }
     }
     if (countVal > 0) {
       seq.push(countVal);
     }
     countVal = 0;
     return seq;
  };

  var listsMatch = function(a, b) {
    a = a || [];
    b = b || [];
    var good = true;
    if (a.length === b.length) {
      for (var i in a) {
        if (a[i] != b[i]) {
          good = false;
        }
      }
    } else {
      good = false;
    }
    return good;
  };

  var drawGrid = function() {
    for (var rowIndex in gridData) {
      var row = document.createElement('div');
      $(row).addClass('row');
      $('.grid').append(row);
      for (var cellIndex in gridData[rowIndex]) {
        var cell = document.createElement('div');
        $(cell).addClass('cell');
        if (gridData[rowIndex][cellIndex] > 1) {
          $(cell).addClass('locked');
        }
        $(row).append(cell);
      }
      var sequence = document.createElement('div');
      $(sequence).addClass('sequence');
      $(row).append(sequence);
    }
    var seqRow = document.createElement('div');
    $(seqRow).addClass('column-sequence');
    $('.grid').append(seqRow);
    for (var i in gridData) {
      var seqCell = document.createElement('div');
      $(seqCell).addClass('vertical sequence');
      $(seqRow).append(seqCell);
    };

    $('.cell').css('background-color', function(index) {
      return gridData[getCoords(index).x][getCoords(index).y] % 2 === 1 ? 'black' : 'white';
    });

  };

  var updateSequences = function() {
    $('.sequence').each( function(index) {
      var seqArr = rowLabels[index];
      var realSeqArr = countRowSequences(gridData[index]);

      var seqStr = '&nbsp;';
      for (var i in seqArr) {
        seqStr += seqArr[i];
        seqStr += ' ';
      }
      $(this).html(seqStr);
      $(this).css('color', function() {
        return listsMatch(seqArr, realSeqArr) ? 'green' : 'red';
      });
    });

    $('.vertical').each( function(index) {
      var seqArr = colLabels[index];
      var realSeqArr = countRowSequences(transposeGrid(gridData)[index]);
      var seqStr = "";
      for (var i in seqArr) {
        seqStr += seqArr[i];
        seqStr += '<br />';
      }
      $(this).html(seqStr);
      $(this).css('color', function() {
        return listsMatch(seqArr, realSeqArr) ? 'green' : 'red';
      });
    })
  };

  var createListeners = function() {

    $('#undo-btn').click(function(e) {
      e.preventDefault();
      undo();
    });

    $('#redo-btn').click(function(e) {
      e.preventDefault();
      redo();
    });
    $('.cell').each( function(index) {
      $(this).on('taphold', function(evt) {
          killClick = true;
          toggleLocked(index);
        });

      $(this).click(function(evt) {
        if (killClick) {
          killClick = false;
          return;
        }
        if (isUnlocked(index)) {
          toggleCell(index);

        }
        updateSequences();
        saveChanges();
      });
    });
  };

  var toggleCell = function(index, isUndoAction) {
      savePrevCellState(index, isUndoAction);

    if (cellContents(index) === 1) {
      $('.cell').eq(index).css('background-color', 'white');
      cellContents(index, 0)
    } else {
      $('.cell').eq(index).css('background-color', 'black');
      cellContents(index, 1);
    }
  };

  var isUnlocked = function(index) {
    return cellContents(index) < 2;
  };

  var isLocked = function(index) {
     return !isUnlocked(index);
  };

  var toggleLocked = function(index) {
    savePrevCellState(index);
    var cells = $('.cell').eq(index).toggleClass('locked');
    var x = getCoords(index).x;
    var y = getCoords(index).y;
    switch(gridData[x][y]) {
      case 0: gridData[x][y] = 2;
              saveChanges();
              break;
      case 1: gridData[x][y] = 3;
              saveChanges();
              break;
      case 2: gridData[x][y] = 0;
              saveChanges();
              break;
      case 3: gridData[x][y] = 1;
              saveChanges();
              break;
    }
  };

  var savePrevCellState = function(index, isUndoAction) {
    initLocalStorage('undoStack');
    initLocalStorage('redoStack');

    var stackName = isUndoAction ? 'redoStack' : 'undoStack';
    var stack = JSON.parse(localStorage.getItem(stackName));
    stack.push({'index': index, 'value': cellContents(index)});
    localStorage.setItem(stackName, JSON.stringify(stack));
  };

  var initLocalStorage = function(itemName) {
    if (!localStorage.hasOwnProperty(itemName)) {
      localStorage.setItem(itemName, '[]');
    }
  };

  var undo = function() {
    stackDo('undoStack');
  };

  var redo = function() {
    stackDo('redoStack');
  }

  var stackDo = function(stackName) {
    var stack = JSON.parse(localStorage.getItem(stackName));
    var prevCell = stack.pop();
    if (isLocked(prevCell.index)) {
      toggleLocked(prevCell.index, stackName === 'undoStack');
    } else {
      toggleCell(prevCell.index, stackName === 'undoStack');
    }
    localStorage.setItem(stackName, JSON.stringify(stack));
  };

  var saveChanges = function() {
    localStorage.setItem('gridData', JSON.stringify(gridData));
  };

  var getCoords = function(index) {
    return { x: Math.floor(index/25), y: index%25 };
  };

  var cellContents = function(index, value) {
    if (value !== undefined) {
      gridData[getCoords(index).x][getCoords(index).y] = value;
    } else {
      return gridData[getCoords(index).x][getCoords(index).y];
    }

  };

  var init = function() {
    initLocalStorage('undoStack');
    initLocalStorage('redoStack');
    loadGrid();
  };

  init();

});
