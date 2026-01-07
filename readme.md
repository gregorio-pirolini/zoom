# Zoom Effect (Magnifier Lens)

Small front-end demo: hover / touch **magnifier lens** zoom on images.

## Features
- **Desktop:** hover zoom
- **Touch devices:** press & hold to activate zoom (no opening a new page)
- Uses responsive images (`srcset`) and automatically upgrades to the large original image

## Tech
- HTML + CSS
- jQuery
- Pointer Events (touch)

## Run locally
Just open `index.html` in a browser.

## Live demo
https://gregorio-pirolini.github.io/zoom/

---

## 📷 Image requirements (important)

### Small vs large image

This zoom effect works by showing a **magnified background image** inside the lens.  
For correct alignment, the small image displayed on the page must be a **scaled version of the large image** (same crop, same aspect ratio).

### Recommended setup

- **Large image (original quality):**
img/image.jpg

- **Displayed image (resized copy):**
img/image-1024x1024.jpg


### The zoom logic assumes:
- both images represent the **same content**
- the small image is only **scaled down**, not cropped

---

## 🏷️ Filename convention

The script automatically derives the large image URL from the displayed image filename.

### Pattern
filename-WIDTHxHEIGHT.ext


### Examples
image1-1024x1024.jpg → image1.jpg
image2-768x768.jpg → image2.jpg


This matches the default image naming used by WordPress and many image pipelines.

### How it works in code

```js
function getLargeImageUrl(src) {
  return src.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp)$)/i, "");
}
⚠️ What happens if this is not respected
----------------------------------------

If the small image:

-   is cropped differently

-   has a different aspect ratio

-   or is not derived from the large image

then the zoomed area will **not line up correctly** with the cursor.

* * * *

✅ Best practice
---------------

-   Always generate resized images from the same original file

-   Keep aspect ratio identical

-   Use the `-WIDTHxHEIGHT` suffix for displayed images