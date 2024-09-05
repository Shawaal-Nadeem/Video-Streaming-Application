markdown
Copy code
# Video Streaming Application Setup

This guide will help you set up a video streaming application using Node.js, Express, and various other packages.

## Step 1: Initialize the Project

Run the following command to create a `package.json` file:

```bash
npm init -y
Step 2: Install Required Packages
Install the necessary packages by running:

bash
Copy code
npm install cors express multer uuid
npm install --save-dev nodemon
Step 3: Update package.json
Open your package.json file and add "type": "module" to enable ES module syntax. Also, update the "scripts" section to use nodemon for development.

Replace:

json
Copy code
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
},
With:

json
Copy code
"scripts": {
  "start": "nodemon index.js"
},
Step 4: Create index.js File
Create an index.js file at the root of your project directory. This file will contain your Express server setup and configuration.

js
Copy code
import express from "express";
import cors from 'cors';
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import fs from "fs";
import { exec } from "child_process";

const app = express();

// CORS configuration
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Multer middleware
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
    }
});

// Multer configuration
const upload = multer({
    storage: multerStorage,
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

// File upload and HLS conversion route
app.post('/upload', upload.single('file'), (req, res) => {
    const lessonID = uuidv4();  // Lesson ID
    const videoPath = req.file.path; // Path for ffmpeg
    const outputPath = `./uploads/courses/${lessonID}`; // Folder path
    const hlsPath = `${outputPath}/index.m3u8`;  // HLS playlist path

    // Create folder for the course if it doesn't exist
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // FFMPEG command to convert video to HLS format
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    // Corrected video URL
    const videoUrl = `http://localhost:8000/uploads/courses/${lessonID}/index.m3u8`;
    res.json({
        message: 'Video converted to HLS format',
        videoUrl: videoUrl,
        lessonID: lessonID
    });
});

// Start server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
Running the Application
To start the server, use the following command:

bash
Copy code
npm start
This will run the server with nodemon, which automatically restarts the server on file changes.
