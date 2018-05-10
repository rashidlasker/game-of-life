var frameInterval, now, start, elapsed, cellArray;

var rows = 10;
var cols = 40;
var cellWidth = 40;
var borderPadding = 20;

function init() {
    frameInterval = 10;
    start = Date.now();
    cellArray = Array(rows).fill().map(() => Array(cols).fill(0));
    console.log(cellArray);
    window.requestAnimationFrame(draw);
}

function draw() {
    window.requestAnimationFrame(draw);
    
    now = Date.now();
    elapsed = now - start;
    console.log(elapsed);
    // if enough time has elapsed, draw the next frame

    if (elapsed > frameInterval) {
        start = now - (elapsed % frameInterval);
        
        const rc = rough.canvas(document.getElementById('canvas'));
        var canvas = document.getElementById('canvas');
        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.width); // clear canvas

        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                if(Math.random() > 0.5){
                    rc.rectangle(borderPadding + i*cellWidth, borderPadding + j*cellWidth, cellWidth, cellWidth, {roughness: 2, fill: 'red' })
                } else {
                    rc.rectangle(borderPadding + i*cellWidth, borderPadding + j*cellWidth, cellWidth, cellWidth, {roughness: 2, fill: 'blue' })
                }
            }
        }
    }    
}

init();