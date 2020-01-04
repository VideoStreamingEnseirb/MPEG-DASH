# MPEG-DASH

# Create his own dash server


Composer helps you declare, manage, and install dependencies of PHP projects.

See https://getcomposer.org/ for more information and documentation.


## Create the MPD file

Download ffmpeg with

sudo apt-get install ffmpeg

`Insérez du code`

`mkdir serverVideo`
`cd serverVideo`

Paste your video in.video into the directory serverVideo

Create the audio file with thes command:

`ffmpeg -i in.video -vn -acodec libvorbis -ab 128k -dash 1 my_audio.webm`

Create then the video files using different quality

ffmpeg -i presentation-filiere-telecommunications.mp4 -c:v libvpx-vp9 -keyint_min 150 \
-g 150 -tile-columns 4 -frame-parallel 1  -f webm -dash 1 \
-an -vf scale=160:90 -b:v 250k -dash 1 video_160x90_250k.webm \
-an -vf scale=320:180 -b:v 500k -dash 1 video_320x180_500k.webm \
-an -vf scale=640:360 -b:v 750k -dash 1 video_640x360_750k.webm \
-an -vf scale=640:360 -b:v 1000k -dash 1 video_640x360_1000k.webm \
-an -vf scale=1280:720 -b:v 1500k -dash 1 video_1280x720_1500k.webm

Create the MPD file

ffmpeg \
  -f webm_dash_manifest -i video_160x90_250k.webm \
  -f webm_dash_manifest -i video_320x180_500k.webm \
  -f webm_dash_manifest -i video_640x360_750k.webm \
  -f webm_dash_manifest -i video_1280x720_1500k.webm \
  -f webm_dash_manifest -i my_audio.webm \
  -c copy \
  -map 0 -map 1 -map 2 -map 3 -map 4 \
  -f webm_dash_manifest \
  -adaptation_sets "id=0,streams=0,1,2,3 id=1,streams=4" \
  my_video_manifest.mpd

## Collaborators

Julien Mathet
Florian Coasnes
Bruno Besse
Lila Martin