# MPEG-DASH

MPEG-DASH is an adaptive bitrate streaming technique that enables high quality streaming of media content over the Internet delivered from conventional HTTP web servers.

See our demo to have a look on the way of work of MPEG DASH.

## Create his own dash server

You will need ffmpeg, whis is a tool for handling video, audio, and other multimedia files and streams. Have a look on their website for more information: https://www.ffmpeg.org

Download and install ffmpeg with:

`sudo apt-get install ffmpeg`

### Create the MPD file

Go into your working directory:

`mkdir serverVideo`  
`cd serverVideo`

Paste your file `in.video` into the folder serverVideo

Create the audio file with thes command:

`ffmpeg -i in.video -vn -acodec libvorbis -ab 128k -dash 1 my_audio.webm` 

Create then the video files in different quality:

`ffmpeg -i presentation-filiere-telecommunications.mp4 -c:v libvpx-vp9 -keyint_min 150 \  
-g 150 -tile-columns 4 -frame-parallel 1  -f webm -dash 1 \  
-an -vf scale=160:90 -b:v 250k -dash 1 video_160x90_250k.webm \  
-an -vf scale=320:180 -b:v 500k -dash 1 video_320x180_500k.webm \  
-an -vf scale=640:360 -b:v 750k -dash 1 video_640x360_750k.webm \  
-an -vf scale=640:360 -b:v 1000k -dash 1 video_640x360_1000k.webm \  
-an -vf scale=1280:720 -b:v 1500k -dash 1 video_1280x720_1500k.webm`

Create the MPD file:

`ffmpeg \
  -f webm_dash_manifest -i video_160x90_250k.webm \
  -f webm_dash_manifest -i video_320x180_500k.webm \
  -f webm_dash_manifest -i video_640x360_750k.webm \
  -f webm_dash_manifest -i video_1280x720_1500k.webm \
  -f webm_dash_manifest -i my_audio.webm \
  -c copy \
  -map 0 -map 1 -map 2 -map 3 -map 4 \
  -f webm_dash_manifest \
  -adaptation_sets "id=0,streams=0,1,2,3 id=1,streams=4" \
  my_video_manifest.mpd`

Read 

### Set up the server in local

Create a folder representating your server, named serverVideo. You can paste your MPD in and the different video fragment related in the MPD. 

After having install your Apache2 server, put the precedent folder in /var/www .

If you have a problem with the CORS, don't forget to allow all the origin modifying the file /etc/apache2/apache2.conf with:


    <Directory /var/www/>  
      Options Indexes FollowSymLinks  
      AllowOverride all  
      Allow from all  
      Require all granted  
      Header set Access-Control-Allow-Origin "*"  
      Header set Access-Control-Allow-Headers "*" 
      Header set Access-Control-Allow-Methods "*"  
      Header set Access-Control-Request-Headers "*"  
    </Directory>

After modifying your server configuration, restart apache2 server with:  
`sudo systemctl reload apache2`  
`sudo systemctl restart apache2`

## Use a dash player for his website

![Dashjs](https://cloud.githubusercontent.com/assets/2762250/7824984/985c3e76-03bc-11e5-807b-1402bde4fe56.png)(https://github.com/Dash-Industry-Forum/dash.js)  
We used the library DashJS to settle our dash player. Have a look on their github: https://github.com/Dash-Industry-Forum/dash.js

You can integrate the player simply by adding those lines:


    <script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
    ...
    <style>
        video {
          width: 640px;
          height: 360px;
        }
    </style>
    ...
    <body>
      <div>
          <video data-dashjs-player autoplay src="https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd" controls></video>
      </div>
    </body>


## Collaborators

Julien Mathet  
Florian Coasnes  
Bruno Besse  
Lilia Martin  