browser.tabs.executeScript({
	file: "/content_scripts/controller.js"
})
	.then(listenForClicks)
	.catch(reportExecuteScriptError);


function listenForClicks() {

	document.onkeydown = function (event) {

		var e = event || window.event || arguments.callee.caller.arguments[0];
		if (e && e.keyCode == 13) {
			//alert('enter');

			let mydialog = document.getElementsByClassName("mydialog")[0];
			if (mydialog.style.display == "block") {
				mydialog.style.display = "none";
				return;
			}


			browser.tabs.query({
				active: true,
				currentWindow: true
			})
				.then(setVolume)
				.catch(reportError);

		}
	}



	function reportExecuteScriptError(error) {

	}




	function isNumber(val) {
		if (parseFloat(val).toString() == "NaN") {

			return false;
		} else {
			return true;
		}
	}

	function setVolume(tabs) {
		var myinput = document.getElementsByClassName("inputvolume")[0];
		var myvolume = myinput.value;

		// var reg = /^[1-9]+[0-9]*]*$/;

		// if (!reg.test(myvolume)) {

		// 	alert("请输入大于1的整数");

		// 	return;

		// }
		// if (myvolume <= 1) {
		// 	alert("请输入大于1的整数");

		// 	return;
		// }


		if (!isFinite(myvolume) || myvolume == "") {
			let mydialog = document.getElementsByClassName("mydialog")[0];
			mydialog.style.display = 'block';
			let mydialogbg = document.getElementsByClassName("mydialogbg")[0];
			let mydialogwindow = document.getElementsByClassName("mydialogwindow")[0];
			let windowWidth = window.innerWidth;
			let windowHeight = window.innerHeight;

			mydialogbg.style.width = windowWidth + "px";
			mydialogbg.style.height = windowHeight + "px";

			let mydialogwindowRect = mydialogwindow.getBoundingClientRect();

			let mydialogwindowWidth = mydialogwindowRect.width;
			let mydialogwindowHeigh = mydialogwindowRect.height;
			mydialogwindow.style.left = (windowWidth - mydialogwindowWidth) / 2 + "px";
			mydialogwindow.style.top = (windowHeight - mydialogwindowHeigh) / 2 + "px";

			return;
		} else {

		}



		browser.tabs.sendMessage(tabs[0].id, {
			command: "setvolume",
			volume: myvolume
		});
		// });

		//alert(document.getElementsByClassName("inputvolume")[0].value);
	}

	function setVolumeFast(tabs) {
		document.getElementsByClassName("inputvolume")[0].value = window.volume;
		setVolume(tabs);
	}


	function resetVolume(tabs) {
		browser.tabs.sendMessage(tabs[0].id, {
			command: "resetvolume"
		});

	}

	function getmultiples(str) {
		return str.substring(1);
	}


	function reportError(error) {
		alert(error);
	}

	document.addEventListener("click", (e) => {

		if (e.target.classList.contains("button10")) {
			browser.tabs.query({
				active: true,
				currentWindow: true
			})
				.then(setVolume)
				.catch(reportError);
		}

		if (e.target.classList.contains("resetButton")) {

			browser.tabs.query({
				active: true,
				currentWindow: true
			})
				.then(resetVolume)
				.catch(reportError);
		}


		if (e.target.classList.contains("setVolumeFastButton")) {
			window.volume = getmultiples(e.target.value);
			browser.tabs.query({
				active: true,
				currentWindow: true
			})
				.then(setVolumeFast)
				.catch(reportError);
		}

		if (e.target.classList.contains("mydialogwindowbutton")) {
			let mydialog = document.getElementsByClassName("mydialog")[0];
			mydialog.style.display = 'none';
		}

		if (e.target.classList.contains("mydialogbg")) {
			let mydialog = document.getElementsByClassName("mydialog")[0];
			mydialog.style.display = 'none';
		}


	});
}
