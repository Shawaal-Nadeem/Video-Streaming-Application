import express from "express";
import cors from 'cors'
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import fs from "fs";
import {exec}  from "child_process";

const app = express();

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    })
)


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static('uploads'))

// multer middleware
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
})

// multer configuration
const upload = multer({
    storage: multerStorage,
})

app.get('/', (req, res) => {
    res.json({message:'Hello World!'})
})

app.post('/upload', upload.single('file'), (req, res) => {
    // console.log(req.file)
    // res.json({message: 'File uploaded successfully'})
    const lessonID = uuidv4();  // Lession ID
    const videoPath = req.file.path; // path for ffmpeg
    const outputPath = `./uploads/courses/${lessonID}`; // folder path address
    const hlsPath = `${outputPath}/index.m3u8`;  // video file path address
    console.log('hls path: ', hlsPath);

    // create folder for the course if not exists
    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive: true})
    }

    //ffmpeg command
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
    exec(ffmpegCommand,  (error, stdout, stderr) => {
        if(error){
            console.log(`Error: ${error.message}`);
            return;
        }
        if(stderr){
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    const videoUrl = `http//localhost:8000/uploads/courses/${lessonID}/index.m3u8`;
    res.json(
        {
            message: 'Video converted to HLS format',
            videoUrl: videoUrl,
            lessonID: lessonID
        }
    )
})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})