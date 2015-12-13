var gridData;
$(document).ready( function() {

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
      createListeners();
    });
  };

  var countGridSequences = function(gridData) {
    var gridSequences = [];
    for (var row in gridData) {
      gridSequences.push(countRowSequences(gridData[row]));
    }
    return gridSequences;
  }

  transposeGrid = function(grid) {
    var tGrid = [];
    for (var i = 0; i < grid[0].length; i++) {
      tGrid.push([]);
      for (var row in grid) {
        tGrid[i].push(grid[row][i]);
      }
    }
    return tGrid;
  };

  countRowSequences = function(rowData) {
     var countVal = 0;
     var seq = [];
     for (var i in rowData) {

       if (rowData[i] === 1) {
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

    // Compares generated list with prescribed list
    listsMatch = function(myArr, a) {
      var good = true;
      if (myArr.length === a.length) {
        for (var blah = 0; blah < myArr.length; blah++) {
          if (myArr[blah] !== a[blah]) {
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
    updateSequences();

    $('.cell').css('background-color', function(index) {
      // var x = Math.floor(index/25);
      // var y = index % 25
      return gridData[getCoords(index).x][getCoords(index).y] === 1 ? 'black' : 'white';
    });

  };
  var updateSequences = function() {
    $('.sequence').each( function(index) {
      var seqArr = countRowSequences(gridData[index]);
      var seqStr = '&nbsp;';
      for (var i in seqArr) {
        seqStr += seqArr[i];
        seqStr += ' ';
      }

      $(this).html(seqStr);
    });
    $('.vertical').each( function(index) {
      var seqArr = countRowSequences(transposeGrid(gridData)[index]);
      var seqStr = "";
      for (var i in seqArr) {
        seqStr += seqArr[i];
        seqStr += '<br />';
      }
      $(this).html(seqStr);
    })
  };

  var createListeners = function() {
    $('.cell').each( function(index) {
      $(this).click(function(evt) {
        if (gridData[getCoords(index).x][getCoords(index).y] === 1) {
          $(this).css('background-color', 'white');
          gridData[getCoords(index).x][getCoords(index).y] = 0;
        } else {
          $(this).css('background-color', 'black');
          gridData[getCoords(index).x][getCoords(index).y] = 1;
        }
        updateSequences();
        saveChanges();
      });
    });
  };

  var saveChanges = function() {
    localStorage.setItem('gridData', JSON.stringify(gridData));
  };

  var getCoords = function(index) {
    return { x: Math.floor(index/25), y: index%25 };
  }

  loadGrid();


});
