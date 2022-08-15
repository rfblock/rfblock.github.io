"use strict";

const firstCommand = "nasm -f elf64 -o website.o website.s;# ld -o website website.o;# ./website##";
const secondCommand = "vim website.s#";

const loadNeofetch = url => {
	let uptimeMins = (new Date() - new Date('Februrary 22 2005')) / 60000 | 0; // `x | 0` rounds down `x`
	const uptimeYrs = uptimeMins / 525600 | 0;

	uptimeMins -= uptimeYrs * 525600;

	const uptimeDays = uptimeMins / 1440 | 0;
	const dayPlural = uptimeDays == 1 ? '' : 's'

	uptimeMins -= uptimeDays * 1440;

	const uptimeHrs = uptimeMins / 60 | 0;
	const hrsPlural = uptimeHrs == 1 ? '' : 's'

	uptimeMins -= uptimeHrs * 60;

	const minPlural = uptimeMins == 1 ? '' : 's'

	const osName = platform.os.family + " x86_" + platform.os.architecture;
	const upTime = `${uptimeYrs} years, ${uptimeDays} day${dayPlural}, ${uptimeHrs} hour${hrsPlural}, ${uptimeMins} min${minPlural}`;
	const resolution = `${screen.width}x${screen.height}`;

	const osNameElement = document.getElementById('neofetch-field-OS');
	const uptimeElement = document.getElementById('neofetch-field-Uptime');
	const resolutionElement = document.getElementById('neofetch-field-Resolution');

	osNameElement.innerText += osName;
	uptimeElement.innerText += upTime;
	resolutionElement.innerText += resolution;
	
	fetch(url)
		.then(res => res.text())
		.then(data => {
			const lines = data.split("\n");
			lines.forEach((line, i) => {
				const element = document.getElementById(`neofetch-line${i}`);
				element.innerHTML = line + '   ' + element.innerHTML;
			})
		});
}

const animateCommand = (command, element, finishedCallback, progress = 0) => {
	const char = command[progress];
	progress++;

	if (char == "#") {
		setTimeout(animateCommand, 500, command, element, finishedCallback, progress);
		return;
	}
	if (char === undefined) { // End of string
		finishedCallback();
		return;
	}

	element.innerHTML += char;

	setTimeout(animateCommand, 20, command, element, finishedCallback, progress);
}

const showErrorCommand = () => {
	const element = document.getElementById("website-command-error");
	element.classList.remove("hidden");
	setTimeout(animateCommand, 2000, secondCommand, document.getElementById('website-command2'), showWebsite);
}

const pages = {}

const loadMainSite = url => {
	fetch(url)
		.then(res => res.json())
		.then(json => {renderPage(json, ''); loadPage('~')})
}

const renderPage = (page, parent) => {
	const name = page.name;
	const directory = (parent != '') ? parent + ' > ' + page.name : page.name
	let longestLength = directory.length;

	for (let i = 0; i < page.pages.length / 2; i++) { // For every other
		let length = page.pages[i*2].display.length;
		if (page.pages[i*2+1] !== undefined) {
			length += page.pages[i*2+1].display.length + 4;
		}
		if (length > longestLength) { longestLength = length; }
	}

	const doubleCrossBar = '═'.repeat(longestLength + 2);
	const emptyLine = '<br/>│' + '&nbsp;'.repeat(longestLength + 2) + '│';

	const directoryTag = document.createElement('span');
	directoryTag.innerText = directory;
	directoryTag.addEventListener('click', () => loadPage('~'));

	let renderedElement = document.createElement('span');
	renderedElement.innerHTML = '╒' + doubleCrossBar + '╕<br/>│&nbsp;';
	renderedElement.appendChild(directoryTag);
	renderedElement.insertAdjacentHTML("beforeend", '&nbsp;'.repeat(longestLength - directory.length + 1) + '│');
	renderedElement.insertAdjacentHTML("beforeend", '<br/>╞' + doubleCrossBar + '╡');

	page.pages.forEach(subPage => {
		subPage.html = document.createElement('span');
		subPage.html.innerText = subPage.display;
		if (subPage.pages !== undefined) {
			subPage.html.classList.add("false-link");
			subPage.html.addEventListener("click", () => loadPage(subPage.name));
			renderPage(subPage, directory); // Create subpage
		} else if (subPage.a !== undefined) {
			subPage.html.classList.add('false-link');
			subPage.html.addEventListener('click', () => window.open(subPage.a, '_blank'));
		} else if (subPage.aInline !== undefined) {
			subPage.html.classList.add('false-link');
			subPage.html.addEventListener('click', () => {window.location = subPage.aInline});
		}
		if (subPage.hover !== undefined) {
			if (subPage.dragon !== undefined) {
				subPage.html.addEventListener('mouseover', () => {lockedTooltip = false; showTooltip(subPage.hover + "<br/>" + randomDragonFact()) });
			} else {
				subPage.html.addEventListener('mouseover', () => {lockedTooltip = false; showTooltip(subPage.hover) });
			}
			subPage.html.addEventListener('mouseout', () => hideTooltip());
		}
	});

	for (let i = 0; i < page.pages.length / 2; i++) { // For every other
		const firstPage = page.pages[i*2];
		const secondPage = page.pages[i*2+1];

		// Space last odd in the center
		if (secondPage === undefined) {
			const difference = longestLength - firstPage.display.length;
			const leftPad = '&nbsp;'.repeat(difference / 2 + 1) // Round down
			const rightPad = '&nbsp;'.repeat(difference / 2 + 0.5 + 1) // Round up
			renderedElement.insertAdjacentHTML("beforeend", '<br/>│' + leftPad);
			renderedElement.appendChild(firstPage.html);
			renderedElement.insertAdjacentHTML("beforeend", rightPad + '│');
			continue;
		}

		const pad = '&nbsp;'.repeat(longestLength - firstPage.display.length - secondPage.display.length);

		renderedElement.insertAdjacentHTML("beforeend", '<br/>│&nbsp;');
		renderedElement.appendChild(firstPage.html);
		renderedElement.insertAdjacentHTML("beforeend", pad);
		renderedElement.appendChild(secondPage.html);
		renderedElement.insertAdjacentHTML("beforeend", '&nbsp;│' + emptyLine);
	}

	if (parent == '') {
		const restartIntroElement = document.createElement('span')
		restartIntroElement.innerText = 'Rewatch Intro?'
		const length = restartIntroElement.innerText.length;
		restartIntroElement.addEventListener('click', () => { localStorage.removeItem('viewedIntro'); location.reload() });

		const pad = '&nbsp;'.repeat(longestLength - length + 1);
		const largePad = '&nbsp;'.repeat(longestLength + 2);
		renderedElement.insertAdjacentHTML("beforeend", '<br/>│' + largePad + '│<br/>│' + pad);
		renderedElement.appendChild(restartIntroElement);
		renderedElement.insertAdjacentHTML("beforeend", ' │');
	}

	renderedElement.insertAdjacentHTML("beforeend", '<br/>┕' + '━'.repeat(longestLength + 2) + '┙');

	pages[name] = renderedElement
}

const loadPage = name => {
	const element = document.getElementById('main-website-content');
	try {
	element.removeChild(element.childNodes[0]);
	} catch (TypeError) {

	}
	element.appendChild(pages[name]);
}

const showWebsite = () => {
	localStorage['viewedIntro'] = true;
	const introElement = document.getElementById("intro-anim");
	const mainSiteElement = document.getElementById("main-website");

	introElement.parentNode.removeChild(introElement);
	mainSiteElement.classList.remove("hidden");
}

const showTooltip = text => {
	const element = document.getElementById('hover-hint');
	element.innerHTML = text.replaceAll('\n', '<br/>');
	element.classList.remove('hidden');
}

const hideTooltip = text => {
	const element = document.getElementById('hover-hint');
	element.classList.add('hidden');
}

const moveTooltip = event => {
	const element = document.getElementById('hover-hint');
	
	element.style.left = event.pageX + 10 + 'px';
	element.style.top = event.pageY + 10 + 'px';
	element.style.right = '';
	element.style.bottom = '';
}

const dragonFacts = []
let lastDragonFact = 0;

const loadDragonFacts = url => {
	fetch(url)
		.then(res => res.text())
		.then(data => data.split('\n').forEach(fact => {dragonFacts.splice(Math.random() * dragonFacts.length | 0, 0, fact.replaceAll('\\n', '\n'))}))
		// Separate each line, replace \n with newlines, and randomly insert them into dragon facts
}

const randomDragonFact = () => dragonFacts[lastDragonFact++ % dragonFacts.length];

let lockedTooltip = false;

const loadDiscordTooltip = () => {
	const element = document.getElementById('discord-wrapper');
	element.addEventListener('mouseover', () => {
		lockedTooltip = true;

		const element = document.getElementById('hover-hint');
		
		element.style.left = '';
		element.style.top = '';
		element.style.right = '8px';
		element.style.bottom = '40px';
		
		showTooltip('Click to copy username');
	});
	element.addEventListener('mouseout', hideTooltip);
}

const main = () => {

	loadMainSite("./src/pages.json");
	loadDragonFacts("./src/dragons.txt");
	loadDiscordTooltip();
	if (localStorage['viewedIntro']) {
		showWebsite();
	} else {
		loadNeofetch('./src/neofetch.html');
		setTimeout(animateCommand, 1000, firstCommand, document.getElementById('website-command1'), showErrorCommand);
	}
	document.addEventListener('mousemove', e => { if (!lockedTooltip) { moveTooltip(e); } });
}

window.onload = main;