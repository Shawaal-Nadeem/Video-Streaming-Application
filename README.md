# Video Streaming Application Setup

Step 1 ->
            npm init -y

Step 2 ->
    Install Packages ->
                        npm i cors
                        npm i express
                        npm i multer
                        npm i uuid
                        npm i -d nodemon

Step 3 -> 
            Edit Package.json file ->
                                        Add  -> "type": "module",
                                        Edit -> "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },    
  
  to      
    "scripts": {
    "start": "nodemon index.js"
  },

Step 4 ->
            Create index.js file at route level

