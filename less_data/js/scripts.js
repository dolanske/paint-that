// Global variables
let brushSize = 10
let color_r = 0
let color_g = 0
let color_b = 0
let globalDecrement = 5
let globalIncrement = 5
let maxBrushSize = 500
let fps = 500
let update, event, brushColor

jQuery(document).ready(function($) {
    // Get the canvas elements
    let canvas = $("#canvas")[0];
    let context = canvas.getContext('2d');
    let bsi = $("#bsi"); // Brush size indicator
    let inputSize = $("#size");
    let brush_slider = $("#brush_slider");

    // Start the drawing event on mouse DOWN
    $(canvas).mousedown((e) => {
        update = setInterval(() => {
            let m = getMousePos(event, canvas);
            let x = m.x - (brushSize / 2);
            let y = m.y - (brushSize / 2);

            draw(x, y, brushSize, context);
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

        updateBSI(brushSize)
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
        let newSize = $("#size").val()
        $("#size").val(newSize)

        setBrushSize(newSize)
        if (newSize > 0) {
            brush_slider.val(newSize)
        }
    })
    // Resets canvas
    $("#clear").click((e) => {
        e.preventDefault()

        context.clearRect(0, 0, canvas.width, canvas.height)
    })

    $("#eraser").click(function(e) {
        e.preventDefault()
        $(this).toggleClass("active")

        if ($(this).hasClass("active")) {
            setBrushColor(255, 255, 255)
        } else {
            setBrushColor(0, 0, 0)
        }
    })

    $("input[type=range]").on("input", function(e) {
        let n = $(this).attr("id");
        let v = $(this).val();

        switch (n) {
            case "color_r":
                color_r = v
                break;
            case "color_g":
                color_g = v
                break;
            case "color_b":
                color_b = v
                break;
            case "brush_slider":
                setBrushSize(v)
                $("#size").val(v)
                break;
        }

        setBrushColor(color_r, color_b, color_g);
        $("#color_display").css({
            "background-color": brushColor
        })
    })
})

function getMousePos(e, element) {
    return {
        x: e.clientX - $(element).offset().left,
        y: e.clientY - $(element).offset().top
    }
}

function draw(x, y, diameter, canvas) {
    canvas.fillStyle = brushColor
    canvas.fillRect(x, y, diameter, diameter);
}

function brushSizeIncrement(increment) {
    if (brushSize > maxBrushSize - increment) {
        setBrushSize(maxBrushSize)
    } else {
        setBrushSize(brushSize + increment)
    }
}

function brushSizeDecrement(decrement) {
    if (brushSize > decrement + decrement) {
        setBrushSize(brushSize - decrement)
    } else {
        setBrushSize(1)
    }
}

function setBrushSize(size) {
    let s = parseInt(size)

    if (s > 0) {
        brushSize = s

        if (s > maxBrushSize) {
            brushSize = maxBrushSize
        }
    }

    updateBSI(brushSize)
}

function updateBSI(brushSize) {
    $(bsi).css({
        width: brushSize,
        height: brushSize,
        left: getMousePos(event, canvas).x - (brushSize / 2),
        top: getMousePos(event, canvas).y - (brushSize / 2),
    })
}

function setBrushColor(r, g, b) {
    brushColor = "rgb(" + r + "," + g + "," + b + ")"
} 
