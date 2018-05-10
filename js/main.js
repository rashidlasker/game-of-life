var frameInterval, now, start, elapsed, cellArray;

const rc = rough.canvas(document.getElementById('canvas'));
var canvas = document.getElementById('canvas');
var ctx = document.getElementById('canvas').getContext('2d');
var canvasWidth = 1640;
var canvasHeight = 840;
var browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

var mobileView = false;
var rows = 20;
var cols = 40;
var cellWidth = 40;
var borderPadding = 20;
var frameInterval = 10;
var updateCellInterval = 500;
var intervalID = undefined;

function init() {
    // Mobile view
    if(window.innerWidth <= 500){
        rows = 40;
        cols = 20;
        canvas.width = canvasHeight;
        canvas.height = canvasWidth;
        canvasHeight = canvas.height;
        canvasWidth = canvas.width;
    }
    // Info Popovers
    tippy('.about', {
        html: '#aboutPopover',
        interactive: true,
        theme: 'dark about',
        size: "small"
    });
    tippy('.help', {
        html: '#helpPopover'
    });
    start = Date.now();
    cellArray = Array(rows).fill().map(() => Array(cols).fill(0));
    initCellArray();
    togglePlay();
    canvas.addEventListener("click", getPosition);
    window.requestAnimationFrame(draw);
}

function togglePlay(){
    if(intervalID==undefined){
        intervalID = setInterval(updateCellArray,updateCellInterval);
        document.getElementById("toggle").innerHTML = "Stop";
    }else{
        clearInterval(intervalID);
        intervalID = undefined;
        document.getElementById("toggle").innerHTML = "Start";
    }
    
}

function initCellArray(){
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            if(Math.random() > 0.8){
                cellArray[i][j] = 1;
            } else {
                cellArray[i][j] = 0;
            }
        }
    }
}
function updateCellArray() {
    let countArray = Array(rows).fill().map(() => Array(cols).fill(0));
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            if(i>0 && j>0 && cellArray[i-1][j-1]==1){
                countArray[i][j]++;
            }
            if(i>0 && cellArray[i-1][j]==1){
                countArray[i][j]++;
            }
            if(j>0 && cellArray[i][j-1]==1){
                countArray[i][j]++;
            }
            if(i>0 && j<cols-1 && cellArray[i-1][j+1]==1){
                countArray[i][j]++;
            }
            if(i<rows-1 && j>0 && cellArray[i+1][j-1]==1){
                countArray[i][j]++;
            }
            if(i<rows-1 && cellArray[i+1][j]==1){
                countArray[i][j]++;
            }
            if(j<cols-1 && cellArray[i][j+1]==1){
                countArray[i][j]++;
            }
            if(i<rows-1 && j<cols-1 && cellArray[i+1][j+1]==1){
                countArray[i][j]++;
            }
        }
    }
    
    let mirrorArray = Array(rows).fill().map(() => Array(cols).fill(0));
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            mirrorArray[i][j] = cellArray[i][j];
            if(cellArray[i][j]==1){
                if(countArray[i][j] < 2 || countArray[i][j] > 3){
                    mirrorArray[i][j] = 0;
                }
            }else{
                if(countArray[i][j] == 3){
                    mirrorArray[i][j] = 1;
                }
            }
        }
    }
    
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            cellArray[i][j] = mirrorArray[i][j];
        }
    }
}

function getPosition(event){
    var x = new Number();
    var y = new Number();
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (event.x != undefined && event.y != undefined)
    {
      x = event.x;
      y = event.y;
    }
    else // Firefox method to get the position
    {
      x = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop - scrollTop;
    let scaledX = x/canvas.offsetWidth * canvasWidth;
    let scaledY = y/canvas.offsetHeight * canvasHeight;
    
    if(scaledX > borderPadding && scaledX < canvasWidth-borderPadding && scaledY > borderPadding && scaledY < canvasHeight-borderPadding){
        rowNum = Math.floor((scaledY-borderPadding)/cellWidth);
        colNum = Math.floor((scaledX-borderPadding)/cellWidth);
        console.log("row:" + rowNum + " col: " +colNum);
        if(cellArray[rowNum][colNum] == 1){
            cellArray[rowNum][colNum] = 0;
        }else{
            cellArray[rowNum][colNum] = 1;
        }
    }
}

function draw() {
    window.requestAnimationFrame(draw);
    
    now = Date.now();
    elapsed = now - start;
    // if enough time has elapsed, draw the next frame
    
    if (elapsed > frameInterval) {
        start = now - (elapsed % frameInterval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
        for(var i = 0; i < rows; i++){
            for(var j = 0; j < cols; j++){
                if(cellArray[i][j] == 1){
                    rc.rectangle(borderPadding + j*cellWidth, borderPadding + i*cellWidth, cellWidth, cellWidth, {roughness: 2, fill: 'green' })
                } else {
                    rc.rectangle(borderPadding + j*cellWidth, borderPadding + i*cellWidth, cellWidth, cellWidth, {roughness: 0})
                }
            }
        }
    }    
}

init();