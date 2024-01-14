(function() {

	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	var nowvolume = 1;
	var volumearray = new Array();

	browser.runtime.onMessage.addListener((message) => {
		if (message.command == "setvolume") {
			nowvolume *= message.volume;
			volumearray.push(message.volume);
			setVolume(message.volume);
		};

		if (message.command == "resetvolume") {
			if (nowvolume != 1) {
				
				for(i=volumearray.length-1;i>=0;i--){
					setVolume(-volumearray[i]);
				}
				
				
				setVolume(1);
			}
			volumearray.splice(0,volumearray.length);

			nowvolume = 1;
		}
		// if (message.command == "resetvolumetest") {
			
		// 		setVolume(0);
			
		// }
	});

	function setVolume(volume) {

		const AudioContext = window.AudioContext || window.webkitAudioContext;
		var audioContexts = new Array();

		var audioElements = document.querySelectorAll("video,audio");

		for (let i = 0; i < audioElements.length; i++) {
			audioContexts[i] = new AudioContext();
		}

		var tracks = new Array();
		for (let i = 0; i < audioElements.length; i++) {
			tracks[i] = audioContexts[i].createMediaElementSource(audioElements[i]);
		}

		var gainNodes = new Array();
		for (let i = 0; i < audioContexts.length; i++) {
			gainNodes[i] = audioContexts[i].createGain();
		}

		for (let i = 0; i < tracks.length; i++) {
			tracks[i].connect(gainNodes[i]).connect(audioContexts[i].destination);
		}

		for (let i = 0; i < tracks.length; i++) {
			gainNodes[i].gain.value = volume;
		}

	}

	


})()
