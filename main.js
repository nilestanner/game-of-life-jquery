$( document ).ready(function() {
  var gridData = Array(10000).fill(0).map(function(i){
    return 0;
  });
  var executing = false;
  var steps = 0;
  var cells;
  var fpsDiv = $('#fps');
  var stepsDiv = $('#steps');
  var posistions = [-101,-100,-99,-1,1,99,100,101];
  var randomBtn = $('#random').click(placeRandom);
  var stepBtn = $('#step').click(step);
  var runBtn = $('#run').click(run);
  var stopBtn = $('#stop').click(stop);
  var resetBtn = $('#reset').click(reset);
  stopBtn.prop('disabled',true);
  buildGrid();

  function buildGrid(){
    var grid = $('#grid');
    cells = gridData.map(function(item,index){
      var cell =  $('<div/>',{
        class: 'cell',
        id: index,
        age: 0,
        click: function() {
          var elm = $(this);
          var age = parseInt(elm.attr('age'));
          var index = parseInt(elm.attr('id'));
          gridData[index] = age?0:1;
          elm.attr('age', age?0:1);
        }
      });
      grid.append(cell);
      return cell;
    });
    stepsDiv.html(steps);
  }

  function step(){
    var oldData = gridData.slice();
    for(var i = 0,len = cells.length;i < len;i++){
      var alive = checkLife(i,oldData);
      if(oldData[i]){
        if(alive){
          if(oldData[i] < 4){
            var age = oldData[i] + 1;
            cells[i].attr('age', age);
            gridData[i] = age;
          }
        }else{
          cells[i].attr('age',0);
          gridData[i] = 0;
        }
      }else{
        if(alive){
          cells[i].attr('age',1);
          gridData[i] = 1;
        }
      }
    }
    stepsDiv.html(++steps);
  }

  function checkLife(index,data){
    var neighbors = 0;
    for(var j = 0, lenj = posistions.length; j < lenj; j++){
      if(data[index + posistions[j]]){
        neighbors++;
        if(neighbors === 4){
          j = lenj;
        }
      }
    }
    switch(neighbors){
      case 2:
        return data[index];
      case 3:
        return 1;
      default:
        return 0;
    }
  }

  function run(){
    executing = true;
    stepBtn.prop('disabled',true);
    runBtn.prop('disabled',true);
    resetBtn.prop('disabled',true);
    stopBtn.prop('disabled',false);
    var frames = 0;
    var totalFrames = 0;
    var timeStart = $.now();

    var fpsCounter = setInterval(function(){
      totalFrames += frames;
      fpsDiv.html(frames);
      var timeNow = $.now();
      $('#avgfps').html((totalFrames/((timeNow - timeStart)/1000)).toFixed(2));
      frames = 0;
      if(!executing){
        clearInterval(fpsCounter);
      }
    },1000);
    function frame(){
      if(executing){
        frames++;
        step();
        setTimeout(function(){
          frame();
        },0);
      }
    }
    frame();
  }

  function stop(){
    executing = false;
    stepBtn.prop('disabled',false);
    runBtn.prop('disabled',false);
    resetBtn.prop('disabled',false);
    stopBtn.prop('disabled',true);
  }

  function placeRandom(){
    cells.forEach(function(cell2,index){
      if(Math.random() < 0.2){
        cell2.attr('age',1);
        gridData[index] = 1;
      }
    });
  }

  function reset(){
    gridData = Array(10000).fill(0).map(function(i){
      return 0;
    });
    cells.forEach(function(cell){
      cell.attr('age',0);
    });
    steps = 0;
    stepsDiv.html(steps);
    fpsDiv.html('');
  }

});
