// Global variables
let brushSize = 10
let changeSizeBy = 2
let maxBrushSize = 250
let fps = 500
let update, event, brushColor
let toolFunction = "draw";
let brush_type

jQuery(document).ready(function($) {
    // Get the canvas elements
    let canvas = $("#canvas")[0];
    let context = canvas.getContext('2d');
    let bsi = $("#bsi"); // Brush size indicator
    let inputSize = $("#size");
    let brush_slider = $("#brush_slider");

    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    brush_slider.attr("max", maxBrushSize)

    // Start the drawing event on mouse DOWN
    $(canvas).mousedown((e) => {
        update = setInterval(() => {
            let m = getMousePos(event, canvas);
            let x = m.x - (brushSize / 2);
            let y = m.y - (brushSize / 2);

            useTool(x, y, brushSize, context);
        }, 1000 / fps);
        return false;
    });

    $("window").on("resize", function(e) {
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;
    })

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
            brushSizeDecrement(changeSizeBy)
        } else {
            brushSizeIncrement(changeSizeBy)
        }

        // Update the brush size input
        inputSize.val(brushSize);

        return false;
    })

    // Update brush size on input change
    $("#size").on("change keyup", (e) => {
        let newSize = $("#size").val()
        $("#size").val(newSize)

        setBrushSize(newSize)
        if (newSize > 0) {
            brush_slider.val(newSize)
        }
    })

    // Tool switching
    $(document).on("click", ".tool-list a", function(e) {
        e.preventDefault();

        let id = $(this).attr("id");

        switch (id) {
            case "brush":
                toolFunction = "draw"
                $("#bsi").addClass("cir")
                break;
            case "clear":
                context.clearRect(0, 0, canvas.width, canvas.height)
                break;
            case "eraser":
                toolFunction = "erase";
                $("#bsi").removeClass("cir")
                break;
        }
    })

    // This is supposed to work with every slider in the program, might restructure later
    $("input[type=range]").on("input", function(e) {
        let n = $(this).attr("id")
        let v = $(this).val()

        switch (n) {
            case "brush_slider":
                setBrushSize(v)
                $("#size").val(v)

                break;
        }
    })

    // Switching tool lists
    $(".tool-list.left a.can-toggle").click(function(e) {
        e.preventDefault()

        $(this).addClass("active").parent().siblings().children("a").removeClass("active");

        let t = $(".top-list").find("ul[data-for='" + $(this).attr("id") + "']")
        $(t).addClass("active").siblings().removeClass("active")
    })

    // Set new color and color indicator
    $("#color_input").on("input", function(e) {
        let c = $(this).val()
        setBrushColor(c)

        $(this).next().css({
            backgroundColor: c,
        })
    })

    $(".set-brush").click(function(e) {
        e.preventDefault()

        // Get the second class name - which is the brush name
        let c = $(this).attr('class').split(' ')[1]

        // Change the brush indicator
        if (c === "circle") {
            $("#bsi").addClass("cir")
        } else {
            $("#bsi").removeClass("cir")
        }

        // Active item
        $(this).addClass("active").parent().siblings().children().removeClass("active")

        // Set the new brush type
        setBrushType(c)
    })
})

function getMousePos(e, element) {
    return {
        x: e.clientX - $(element).offset().left,
        y: e.clientY - $(element).offset().top
    }
}

function setBrushType(type) {
    brush_type = type;
}

function useTool(x, y, diameter, canvas) {
    let brush = new Path2D();

    switch (toolFunction) {
        case "draw":
            // Set the color
            canvas.fillStyle = brushColor

            // Set the brush
            brush.arc(x + diameter / 2, y + diameter / 2, diameter / 2, 0, 2 * Math.PI);
            brush_type === "circle" ? canvas.fill(brush) : canvas.fillRect(x, y, diameter, diameter)
            break;
        case "erase":
            canvas.clearRect(x, y, diameter, diameter)
    }
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

function setBrushColor(color) {
    brushColor = color
}
