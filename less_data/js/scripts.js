// Global variables
let brushSize = 10;
let brushColor;
let globalDecrement = 5;
let globalIncrement = 5;
let maxBrushSize = 500;
let fps = 300;
let update;
let event;

jQuery(document).ready(function($) {
    // Get the canvas elements
    let canvas = $("#canvas")[0];
    let ctx = canvas.getContext('2d');

    let inputSize = $("#size");

    // Start the drawing event on mouse DOWN
    $(canvas).mousedown((e) => {
        update = setInterval(() => {
            let m = getMousePos(event, canvas);
            let x = m.x - (brushSize / 2);
            let y = m.y - (brushSize / 2);

            draw(x, y, brushSize, ctx);
        }, 1000 / fps);
        return false;
    });

    // Release the drawing event
    $(document).mouseup(() => {
        clearInterval(update);

        return false;
    });

    // Constantly fetch the mouse position
    $(document).mousemove((e) => {
        event = e;
    });

    // Change brush size on mouse scroll up / down
    $(canvas).bind('DOMMouseScroll', (e) => {
        if (e.originalEvent.detail > 0) {
            brushSizeDecrement(globalDecrement)
        } else {
            brushSizeIncrement(globalIncrement)
        }

        // Update the brush size input
        inputSize.val(brushSize);

        return false;
    });

    // Update brush size on input change
    $("#size").on("change keyup", (e) => {
        let newSize = $("#size").val();
        $("#size").val(newSize);

        setBrushSize(newSize);
    })
});

function getMousePos(e, element) {
    return {
        x: e.clientX - $(element).offset().left,
        y: e.clientY - $(element).offset().top
    }
}

function draw(x, y, diameter, canvas) {
    canvas.fillRect(x, y, diameter, diameter);
}

function brushSizeIncrement(increment) {
    if (brushSize > maxBrushSize - increment) {
        brushSize = maxBrushSize
    } else {
        brushSize += increment;
    }

    e("Updated brush size: " + brushSize + "px");
}

function brushSizeDecrement(decrement) {
    if (brushSize > decrement + decrement) {
        brushSize -= decrement;
    } else {
        brushSize = 1;
    }

    e("Updated brush size: " + brushSize + "px");
}

function setBrushSize(size) {
    let s = parseInt(size);

    if (s > 0) {
        brushSize = size;

        if (size > maxBrushSize) {
            brushSize = maxBrushSize;
        }
    }

    e("Updated brush size: " + brushSize + "px");
}
