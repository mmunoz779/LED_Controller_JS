/**
 *
 * HTML5 Color Picker
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

$(function(){
    let bCanPreview = true; // can preview

    // create canvas and context objects
    let canvas = document.getElementById('picker');
    let ctx = canvas.getContext('2d');

    // drawing active image
    let image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }

    // select desired colorwheel
    let imageSrc = '../images/colorwheel3.png';
    image.src = imageSrc;
    image.crossOrigin = null;

    $('#picker').mousemove(function(e) { // mouse move handler
        if (bCanPreview) {
            // get coordinates of current position
            let canvasOffset = $(canvas).offset();
            let canvasX = Math.floor(e.pageX - canvasOffset.left);
            let canvasY = Math.floor(e.pageY - canvasOffset.top);

            // get current pixel
            let imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            let pixel = imageData.data;

            // update preview color
            let pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
            $('.preview').css('backgroundColor', pixelColor);

            // update controls
            $('#rVal').val(pixel[0]);
            $('#gVal').val(pixel[1]);
            $('#bVal').val(pixel[2]);
            $('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2]);

            let dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
            $('#hexVal').val('#' + ('0000' + dColor.toString(16)).substr(-6));
        }
    }).click(function(e) { // click event handler
        bCanPreview = !bCanPreview;
    });
    $('.preview').click(function(e) { // preview click
        $('.colorpicker').fadeToggle("slow", "linear");
        bCanPreview = true;
    });
    $('.controls').change(function(e){
        let rgb = $('.rgbVal').split(",");
        // update preview color
        let pixelColor = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
        $('.preview').css('backgroundColor', pixelColor);
    })
});