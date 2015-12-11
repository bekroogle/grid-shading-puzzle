var numlist;
var reallist;
var binlist = [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1];
var binmatrix = [
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1]
];

$(document).ready(function() {

  $('#numlist').change(function (e) {
    var numstring = $(this).val();
    numlist = numstring.split('');
    for (var i = 0; i < numlist.length; i++) {
      numlist[i] = parseInt(numlist[i]);
    }

    checkMatch(numlist,reallist);
  });

var checkMatch = function(lista, listb) {
  $('input').css('border', function() {
    return listsMatch(lista,listb) ? '3px solid green' : '3px solid red';
  });
};

  // Generates list from row:
  var generateList = function(ax) {
    var myArr = [];
    var countval = 0;
    for (var i = 0; i < ax.length; i++) {

      if (ax[i] === 1) {
        countval++;
      } else {
          if (countval > 0) {
            myArr.push(countval);
          }
        countval = 0;
      }
    }
    if (countval > 0) {
      myArr.push(countval);
    }
    return myArr;
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

  var createHtmlGrid = function(width, height) {
    createHtmlRows(height);
    createHtmlCols(width);
    setGridColors();
    createCellIds();
  };

  var createHtmlRows = function(height) {
    for (var i = 0; i < height; i++) {
      var newRow = document.createElement('div');
      $(newRow).addClass('row');
      $(newRow).data('binlist', binmatrix[i]);
      $('.grid').append(newRow);
    }
  };

  var createHtmlCols = function(width) {
    for (var i = 0; i < width; i++) {
      $('.row').append('<div class="cell"></div>')
    }
  };

  var setGridColors = function(rowlist) {
    $('.cell').each( function(index) {
      $(this).css('background-color', function() {
        color = $(this).parent().data('binlist')[index] === 1 ? 'black' : 'white';
        return color;
      });
    });
  };

  var createCellIds = function() {
    $('.cell').each( function (index) {
      $(this).attr('id', index);
    });
  };

  var setRealList = function() {
    reallist = generateList(binlist);
    $('#reallist').val(reallist);

  };

  createHtmlGrid(binlist.length,binmatrix.length);
  setRealList();

  var toggleCell = function(id) {
    var myBinList = $(id).parent().data('binlist');
    myBinList[id] = myBinList[id] === 1 ? 0 : 1;
    setGridColors();
    setRealList();
    checkMatch(numlist, reallist);
  };

  $('.cell').click( function(e) {
    toggleCell(this);
  });
});
