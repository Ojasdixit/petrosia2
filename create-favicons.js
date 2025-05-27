/**
 * Script to create favicon PNG files from our SVG
 */
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const createPng = async (svgPath, outputPath, size) => {
  try {
    // Create canvas with the desired dimensions
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fill the background with the brand orange color
    ctx.fillStyle = '#ff6b00';
    ctx.fillRect(0, 0, size, size);
    
    // Save the png file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Created ${outputPath} (${size}x${size})`);
  } catch (err) {
    console.error(`Error creating ${outputPath}:`, err);
  }
};

// Create the favicon files
(async () => {
  try {
    await createPng('./public/petrosia-paw.svg', './public/favicon-16x16.png', 16);
    await createPng('./public/petrosia-paw.svg', './public/favicon-32x32.png', 32);
    await createPng('./public/petrosia-paw.svg', './public/apple-touch-icon.png', 180);
    console.log('Favicon creation completed.');
  } catch (err) {
    console.error('Error creating favicons:', err);
  }
})();