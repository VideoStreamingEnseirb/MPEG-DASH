var player;
function init() {
    var video;
    var url = "http://rdmedia.bbc.co.uk/dash/ondemand/testcard/1/client_manifest-events.mpd";

    video = document.querySelector("video");
    player = dashjs.MediaPlayer().create();
    player.initialize(video, url, true);

    document.getElementById("trace").innerHTML = "";
    document.getElementById("trace2").innerHTML = "";
    setListener();

    applySettings()

    player.on(dashjs.MediaPlayer.events["PLAYBACK_ENDED"], function () {
        clearInterval(eventPoller);
    });

    var eventPoller = setInterval(function () {
        var streamInfo = player.getActiveStream().getStreamInfo();
        var dashMetrics = player.getDashMetrics();
        var dashAdapter = player.getDashAdapter();

        if (dashMetrics && streamInfo) {
            const periodIdx = streamInfo.index;
            var repSwitch = dashMetrics.getCurrentRepresentationSwitch('video', true);
            var bufferLevel = dashMetrics.getCurrentBufferLevel('video', true);
            var bitrate = repSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(repSwitch.to, periodIdx) / 1000) : NaN;
            document.getElementById('currentBufferLevel').innerText = bufferLevel + " secs";
            document.getElementById('reportedBitrate').innerText = bitrate + " Kbps";
        }
    }, 1000);
}

function log(msg, type) {
    var tracePanel = document.getElementById("trace");
    if (type == 0) {
        tracePanel.innerHTML += "<span style='background-color:yellow;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else if (type == 1) {
        tracePanel.innerHTML += "<span style='background-color:green;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else if (type == 2) {
        tracePanel.innerHTML += "<span style='background-color:red;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else if (type == 3) {
        tracePanel.innerHTML += "<span style='background-color:#43F700;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else {
        tracePanel.innerHTML += msg;
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
}

function log2(msg, type) {
    var tracePanel = document.getElementById("trace2");
    if (type == 0) {
        tracePanel.innerHTML += "<span style='background-color:yellow;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else if (type == 1) {
        tracePanel.innerHTML += "<span style='background-color:green;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else if (type == 2) {
        tracePanel.innerHTML += "<span style='background-color:red;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else if (type == 3) {
        tracePanel.innerHTML += "<span style='background-color:#43F700;'>" + msg + " </span>";
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }
    else {
        tracePanel.innerHTML += msg;
        tracePanel.innerHTML += "<br>"
        tracePanel.scrollTop = tracePanel.scrollHeight;
    }

}

function setListener() {
    player.on(dashjs.MediaPlayer.events["CAN_PLAY"], showEvent);
    player.on(dashjs.MediaPlayer.events["FRAGMENT_LOADING_STARTED"], showEvent);
    player.on(dashjs.MediaPlayer.events["MANIFEST_LOADED"], showEvent);
    player.on(dashjs.MediaPlayer.events["FRAGMENT_LOADING_COMPLETED"], showEvent);
    player.on(dashjs.MediaPlayer.events["FRAGMENT_LOADING_ABANDONED"], showEvent);
    player.on(dashjs.MediaPlayer.events["QUALITY_CHANGE_REQUESTED"], showEvent);
    player.on(dashjs.MediaPlayer.events["QUALITY_CHANGE_RENDERED"], showEvent);

}


function showEvent(e) {
    //console.log("EVENT RECEIVED: " + e.type);
    //log("EVENT RECEIVED: " + e.type);
    //console.log(e.type)
    //We double process in order to pretty-print. Only two levels of object properties are exposed.
    if (e.type == "fragmentLoadingStarted") {
        for (var index in e) {
            if (index == "request") {
                // for (var index2 in e[index]){
                //   log("on a :"+ index2 +" pour "+e[index][index2])
                // }
                if (e[index]["mediaType"] == "video") {
                    log("Le FRAGMENT " + e[index]["index"] + " commence à charger, le FRAGMENT commence à " + e[index]["startTime"] + " avec une qualité de " + e[index]["representationId"], 0)
                }
                else {
                    log2("Le FRAGMENT " + e[index]["index"] + " commence à charger, le FRAGMENT commence à " + e[index]["startTime"] + " avec une qualité de " + e[index]["representationId"], 0)
                }
            }

        }
    }
    else if (e.type == "fragmentLoadingCompleted") {
        for (var index in e) {
            if (index == "request") {
                // for (var index2 in e[index]){
                //   log("on a :"+ index2 +" pour "+e[index][index2])
                // }
                if (e[index]["mediaType"] == "video") {
                    log("Le FRAGMENT " + e[index]["index"] + e[index]["mediaType"] + " a fini de charger", 1)
                }
                else {
                    log2("Le FRAGMENT " + e[index]["index"] + e[index]["mediaType"] + " a fini de charger", 1)
                }
            }
        }
    }
    else if (e.type == "fragmentLoadingAbandoned") {
        for (var index in e) {
            if (index == "request") {
                // for (var index2 in e[index]){
                //   log("on a :"+ index2 +" pour "+e[index][index2])
                // }
                if (e[index]["mediaType"] == "video") {
                    log("Le FRAGMENT " + e[index]["index"] + " a été abandonné", 2)
                }
                else {
                    log2("Le FRAGMENT " + e[index]["index"] + " a été abandonné", 2)
                }
            }
        }
    }

    else if (e.type == "qualityChangeRequested") {
        if (e["mediaType"] == "video") {
            log("QUALITY CHANGE: On passe de " + e["oldQuality"] + " à " + e["newQuality"], 3)
        }
        else {
            log2("QUALITY CHANGE: On passe de " + e["oldQuality"] + " à " + e["newQuality"], 3)
        }

    }

    else if (e.type == "qualityChangeRendered") {

        if (e["mediaType"] == "video") {
            log("QUALITY CHANGE: On passe de " + e["oldQuality"] + " à " + e["newQuality"], 3)
        }
        else {
            log2("QUALITY CHANGE: On passe de " + e["oldQuality"] + " à " + e["newQuality"], 3)
        }

    }

}


function applySettings() {
    var stableBuffer = parseInt(document.getElementById('stableBuffer').value, 10);
    var bufferAtTopQuality = parseInt(document.getElementById('topQualityBuffer').value, 10);
    var minBitrate = parseInt(document.getElementById('minBitrate').value, 10);
    var maxBitrate = parseInt(document.getElementById('maxBitrate').value, 10);
    var limitByPortal = document.getElementById('limitByPortal').checked;

    player.updateSettings({
        'streaming': {
            'stableBufferTime': stableBuffer,
            'bufferTimeAtTopQualityLongForm': bufferAtTopQuality,
            'abr': {
                'minBitrate': {
                    'video': minBitrate
                },
                'maxBitrate': {
                    'video': maxBitrate
                },
                'limitBitrateByPortal': limitByPortal
            }
        }
    })
}
