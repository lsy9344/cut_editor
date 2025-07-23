Migration Plan: PySide2 to Electron
1. Introduction
This document outlines the plan for migrating the "XYZ Studio" application from a Python/PySide2/OpenCV stack to an Electron/HTML/CSS/JavaScript stack. The plan is derived from an analysis of the provided basic.py and ui.ui files. The goal is to replicate the existing functionality feature by feature.

2. Functional Decomposition
2.1. UI/Layout Analysis (ui.ui)
The user interface is composed of two main sections within a grid layout: a canvas area on the left and a control panel on the right.

Control Panel Components:

Buttons: init_btn (Reset All), frame_btn (Select Frame), init_image_btn (Reset Selected Image), text_apply_btn (Apply Text), download_btn (Download).

Inputs: scale_lineEdit (Image Size %), font_lineEdit (Font Size), textEdit (Text Content).

Labels: Static labels for titles, version info, and input fields.

Status Display: log_label for user feedback.

Canvas Area (QStackedWidget):

A multi-page widget where each page corresponds to a specific frame template.

Frame templates are identified by filename conventions (e.g., 2_horizontal, 4_vertical).

Each page contains a grid of QLabel widgets that serve as placeholders for user images (e.g., frame_2_hor_image1).

Each page has dedicated QLabel widgets for text overlays (e.g., frame_2_ver_label, frame_4_hor_label_1).

2.2. Application Logic Analysis (basic.py)
The core logic handles state management, event processing, image manipulation, and final image exporting.

State Management:

The main class holds the application's state, including:

Paths to frame and user images (frame_image_path, image_paths).

OpenCV image objects in memory (images).

Image transformation data: scale (zoom level) and moved (x, y coordinates) for each image slot.

The currently selected image slot (clicked_label).

A custom font loaded from a .ttf file.

Core Functionality:

Frame Selection (select_frame):

Opens a file dialog to select a frame template PNG.

Parses the filename to determine the layout (e.g., 2-cut horizontal, 4-cut vertical).

Switches the QStackedWidget to the corresponding page.

Loads the selected frame as a transparent overlay.

Image Selection (select_image):

Triggered by clicking an image placeholder QLabel.

Opens a file dialog to select a user image.

Loads the image with OpenCV.

Calculates an initial scale to fit the image within the placeholder.

Stores the image data and resets its transformation state.

Image Manipulation:

Panning (draggable): A custom event filter tracks mouse movements to update the moved (x, y) state for the selected image.

Zooming (wheelable, scale_changed): A custom event filter tracks mouse wheel events to update the scale state. The scale can also be set directly via a text input.

Rendering (set_image_to_label): Applies the scale and moved transformations to the source image, crops it to the placeholder's boundaries, and displays it. Draws a red crosshair over the image for alignment.

Text Application (apply_btn_clicked):

Reads text and font size from the UI.

Applies the text and font styles to the dedicated text overlay labels.

Handles logic for splitting text for horizontal frames vs. assigning it whole for vertical frames.

High-Resolution Export (export_image):

Calculates dimensions for a high-DPI (1200) output image.

Creates a new blank image canvas using numpy.

For each user image, it scales the image and its transformations (position, zoom) to the high-DPI canvas dimensions and draws it.

Loads the frame template image, scales it to the high-DPI dimensions, and alpha-blends it over the user images.

Uses the PIL library (ImageFont, ImageDraw) to render the text onto the canvas, replicating the font, size, alignment, and italic shear effect.

Opens a save file dialog to write the final image to disk as a PNG or JPG.

3. Migration Task Breakdown
The migration will be executed in phases, mapping the Python/Qt functionality to web technologies.

Phase 1: UI and Layout Reconstruction (HTML/CSS)
Task 1.1: Main Structure: Create an index.html. Use Flexbox or CSS Grid to establish the two-column layout (canvas area and control panel).

Task 1.2: Control Panel: Replicate all widgets from the control panel using standard HTML form elements (<button>, <input>, <textarea>, <div> for labels). Assign unique IDs to each element for JavaScript access.

Task 1.3: Canvas Area:

Create a container div (#canvas-container) with position: relative.

Inside the container, create div elements for each frame template (e.g., <div id="frame-2-hor" class="frame-template">). These will be shown/hidden to mimic the QStackedWidget.

Within each frame template div, create div elements (.photo-slot) that correspond to the QLabel image placeholders. Position them absolutely based on the original UI's layout.

Create an <img> (#frame-overlay) for the transparent frame template, positioned absolutely with a high z-index.

Create div elements (.text-overlay) for text, positioned absolutely with the highest z-index.

Phase 2: State Management and Event Handling (JavaScript)
Task 2.1: Global State Object: Define a single JavaScript object to hold the application's state, mirroring the properties of the Python class.

const state = {
  currentFrameId: null, // e.g., 'frame-2-hor'
  frame: { path: null, element: document.getElementById('frame-overlay') },
  slots: [], // [{ image: null, scale: 100, x: 0, y: 0, element: ... }]
  text: { content: '', fontSize: 12, elements: [...] }
};

Task 2.2: Event Listeners: Attach event listeners (click, input, change) to all control panel elements.

Task 2.3: Frame Selection Logic: On #select-frame-btn click, open a file dialog. Based on the selected file's name, update state.currentFrameId, display the correct frame template div, and set the #frame-overlay's src.

Task 2.4: Image Selection Logic: On .photo-slot click, open a file dialog. Use FileReader to load the image, store its data and initial scale in the corresponding state.slots entry, and trigger a render.

Phase 3: Image Manipulation and Rendering (JavaScript/CSS)
Task 3.1: Image Rendering Function: Create a function renderSlot(index) that reads the x, y, and scale from state.slots[index] and applies them to the slot's <img> element using CSS transform: translate(x, y) scale(value).

Task 3.2: Drag-to-Pan Logic: Add mousedown, mousemove, and mouseup event listeners to .photo-slot. The mousemove handler will calculate the delta from the start position, update the x and y values in the state, and call renderSlot.

Task 3.3: Wheel-to-Zoom Logic: Add a wheel event listener to .photo-slot. The handler will modify the scale value in the state and call renderSlot.

Phase 4: Text Rendering (JavaScript)
Task 4.1: Text Application Logic: On #apply-text-btn click, update the state.text object.

Task 4.2: Text Rendering Function: Create a function renderText() that reads from state.text and updates the innerHTML and style.fontSize of the .text-overlay elements. For vertical text, apply the CSS property writing-mode: vertical-rl;.

Phase 5: High-Resolution Export (HTML Canvas API)
Task 5.1: Export Function: Create an async function exportImage() triggered by the download button.

Task 5.2: Canvas Creation: Create an in-memory <canvas> element. Calculate its width and height based on a target DPI (e.g., 300) and physical dimensions (e.g., 15x10 cm).

Task 5.3: Drawing Images:

Calculate the ratio between the on-screen display size and the high-DPI canvas size.

For each slot, load the user image. Use ctx.drawImage() to render it onto the canvas, applying the state's x, y, and scale values multiplied by the size ratio.

Task 5.4: Drawing Frame and Text:

Draw the frame template image over the entire canvas.

Set canvas context properties (ctx.font, ctx.fillStyle). Use ctx.setTransform() to apply the italic shear effect.

Draw the text using ctx.fillText(), ensuring position and font size are scaled by the size ratio.

Task 5.5: File Download: Convert the canvas to a data URL using canvas.toDataURL(). Create a temporary <a> element with this URL as its href and a download attribute, then programmatically click it to trigger the download.