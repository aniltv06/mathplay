# PWA Icons

## Required Icons

To make this app fully functional as a PWA, you need to add icon files in the following sizes:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons

### Option 1: Using Online Tools (Easiest)
1. Create a square logo (512x512px recommended) with your design
2. Visit [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) or [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Upload your logo
4. Download the generated icons
5. Place them in this `/icons` directory

### Option 2: Using ImageMagick (CLI)
If you have ImageMagick installed:

```bash
# Starting from a 512x512 source image
convert source.png -resize 72x72 icon-72x72.png
convert source.png -resize 96x96 icon-96x96.png
convert source.png -resize 128x128 icon-128x128.png
convert source.png -resize 144x144 icon-144x144.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 384x384 icon-384x384.png
convert source.png -resize 512x512 icon-512x512.png
```

### Option 3: Simple Emoji-based Icon
For a quick test icon, you can use an emoji as your icon:
1. Visit [Emoji to PNG](https://emoji.gg/) or [Favicon.io](https://favicon.io/emoji-favicons/)
2. Choose a math-related emoji like 🎉, 🔢, or ➕
3. Generate and download icons
4. Place them in this directory

## Design Recommendations

- Use a simple, bold design that's recognizable at small sizes
- Ensure good contrast for visibility
- Consider using the app's purple gradient (#667eea to #764ba2)
- Include math-related imagery (numbers, operators, etc.)
- Keep it kid-friendly and colorful

## Temporary Placeholder

Until you add real icons, the PWA will work but won't have an app icon when installed. The browser will use a default icon or screenshot instead.
