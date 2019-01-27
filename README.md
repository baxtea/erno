# Erno
A Rubik's Cube simulator written in TypeScript and WebGL

[![GitHub license](https://img.shields.io/github/license/baxtea/erno.svg)](https://github.com/baxtea/erno/blob/master/LICENSE)

Erno is live at https://baxtea.github.io/erno!
![Screenshot of the landing page](/doc/screenshot.png)

# Key Features

 - Erno supports two methods of executing arbitrary algorithms: the textbox and the canvas.
   - The textbox fully supports the standard algorithm syntax described [here](http://www.rubiksplace.com/move-notations/), including double-slice and mid-slice turns.
   - The canvas only supports a subset of the same syntax, since I have not found a way to map 180-degree rotations or double-slice turns to a keyboard. The full list of keyboard inputs is overlaid on the canvas when the page is loaded.
 - Free rotation to point towards the cursor, letting any face be seen without a turn command
 - Smooth animation using quaternions
 - Simple scrambling

Erno **does not** solve cubes, although this is planned for the future.

# Building

(Erno uses [npm](https://www.npmjs.com/) to manage dependencies.)

If this is your first time building erno, type `npm install` in the repository's base directory to install the project's dependencies.

To build a static version of the page, type `npm run build` and open `index.html`.

To locally host a version which automatically refreshes to reflect changes, type `npm start`. If the page fails to launch in your browser, manually navigate to `localhost:3000`.