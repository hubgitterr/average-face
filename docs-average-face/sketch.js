// Code is changed so that the image drawn on the left is a random face from the array of faces
// rather than just the first one, with a new random face selected using the keyPressed() function.
// On mouse moved we have the pixel values of the second image transition between the randomly selected image 
// and the average image based on the mouseX value.

var imgs = []; // Declare variable 'imgs'
var avgImg; // Declare variable 'avgImg'
var currentImgIndex = 0; // Index of the current image
var numOfImages = 30; // The number of images to be loaded and averaged (change this number to the number of images you have)

//////////////////////////////////////////////////////////
function preload() { // preload() runs once before setup()
  for (let i = 0; i < numOfImages; i++) { // Load all images into an array called 'imgs'
    let filename = 'assets/' + i + '.jpg'; // this is a path relative to the index.html file (or the root of the sketch folder)
    imgs.push(loadImage(filename)); // Load each image into the array (imgs[0] = first image, imgs[1] = second image, etc.)
    console.log('Loaded: ' + filename); // Print the filename to console to confirm it's loaded
  }
}
//////////////////////////////////////////////////////////
function setup() {
  createCanvas(imgs[0].width * 2, imgs[0].height); // Set canvas width to twice the width of the first image
  pixelDensity(1); // Set pixel density to 1 to avoid retina scaling issues

  avgImg = createGraphics(imgs[0].width, imgs[0].height); // Create an empty buffer for calculations
}
//////////////////////////////////////////////////////////
function draw() {
  background(125);

  for (let i = 0; i < numOfImages; i++) {
    imgs[i].loadPixels(); // Load pixels for each image
  }
  avgImg.loadPixels(); // Load pixels for avgImg

  let lerpedImage = lerpImage(imgs[currentImgIndex], avgImg, mouseX / width); // Lerp between the current image and the average image based on mouseX position (0 = current image, 1 = average image) 

  image(lerpedImage, 0, 0); // Draw the lerped image on the left
  
  // Nested loop to manipulate pixel data
  for (let y = 0; y < imgs[0].height; y++) { // Loop through all pixels in the image (y axis)
    for (let x = 0; x < imgs[0].width; x++) { // Loop through all pixels in the image (x axis)
      let index = (x + y * imgs[0].width) * 4; // Convert x, y to pixel index (multiply by 4 because each pixel has 4 channels: red, green, blue, alpha)
      
      let sumR = 0; // Declare variables to store sum of each channel for all images at this pixel
      let sumG = 0; // Declare variables to store sum of each channel for all images at this pixel
      let sumB = 0; // Declare variables to store sum of each channel for all images at this pixel
      
      // Loop through all images to calculate sum of each channel
      for (let i = 0; i < numOfImages; i++) { // Loop through all images (i = image index)
        let imgIndex = (x + y * imgs[i].width) * 4; // Convert x, y to pixel index for this image
        sumR += imgs[i].pixels[imgIndex]; // Add red channel value to sumR variable for this pixel
        sumG += imgs[i].pixels[imgIndex + 1]; // Add green channel value to sumG variable for this pixel 
        sumB += imgs[i].pixels[imgIndex + 2]; // Add blue channel value to sumB variable for this pixel
      }
      
      // Calculate average channel values
      let avgR = sumR / numOfImages; // Divide sumR by the number of images to get average red channel value
      let avgG = sumG / numOfImages; // Divide sumG by the number of images to get average green channel value
      let avgB = sumB / numOfImages; // Divide sumB by the number of images to get average blue channel value
      
      // Update avgImg pixel values
      avgImg.pixels[index] = avgR; // Update red channel value for this pixel in avgImg to the average red channel value calculated above 
      avgImg.pixels[index + 1] = avgG; // Update green channel value for this pixel in avgImg to the average green channel value calculated above 
      avgImg.pixels[index + 2] = avgB; // Update blue channel value for this pixel in avgImg to the average blue channel value calculated above 
      avgImg.pixels[index + 3] = 255; // Alpha channel to 255 (opaque)
    }
  }

  avgImg.updatePixels(); // Update pixel data of avgImg
  image(avgImg, imgs[0].width, 0); // Draw avgImg on the right
}
//////////////////////////////////////////////////////////
function keyPressed() {
  currentImgIndex = floor(random(numOfImages)); // Select a random image index
  redraw(); // Redraw the canvas with the new image
}

function lerpImage(img1, img2, amt) { // Function to lerp between two images based on amt (0 = img1, 1 = img2)
  let lerpedImage = createImage(img1.width, img1.height); // Create an empty image buffer to store the lerped image data
  lerpedImage.loadPixels(); // Load pixels for lerpedImage buffer (required to manipulate pixel data)
  
  for (let y = 0; y < img1.height; y++) { // Loop through all pixels in the image (y axis) 
    for (let x = 0; x < img1.width; x++) { // Loop through all pixels in the image (x axis) 
      let index = (x + y * img1.width) * 4; // Convert x, y to pixel index (multiply by 4 because each pixel has 4 channels: red, green, blue, alpha)
      
      let r = lerp(img1.pixels[index], img2.pixels[index], amt); // Lerp between the red channel values of img1 and img2 based on amt (0 = img1, 1 = img2)
      let g = lerp(img1.pixels[index + 1], img2.pixels[index + 1], amt); // Lerp between the green channel values of img1 and img2 based on amt (0 = img1, 1 = img2) 
      let b = lerp(img1.pixels[index + 2], img2.pixels[index + 2], amt); // Lerp between the blue channel values of img1 and img2 based on amt (0 = img1, 1 = img2) 
      
      lerpedImage.pixels[index] = r; // Update red channel value for this pixel in lerpedImage to the lerped red channel value calculated above 
      lerpedImage.pixels[index + 1] = g; // Update green channel value for this pixel in lerpedImage to the lerped green channel value calculated above
      lerpedImage.pixels[index + 2] = b; // Update blue channel value for this pixel in lerpedImage to the lerped blue channel value calculated above
      lerpedImage.pixels[index + 3] = 255; // Alpha channel to 255
    }
  }
  
  lerpedImage.updatePixels(); // Update pixel data of lerpedImage buffer (required to manipulate pixel data) 
  return lerpedImage; // Return the lerped image buffer 
}

  