"use strict";

const firstCommand = "nasm -f elf64 -o website.o website.s;# gcc website.o -no-pie -o website;# ./website##";
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

const loadMainSite = url => {
	fetch(url)
		.then(res => res.json())
		.then(json => renderPage(json, document.querySelector('#main-website-content'), -1))
}

const renderPage = (page, parent, level, last) => {
	const name = page.name ?? page.display;

	const pipe = '│';
	const dir = last ? '└╴' : '├╴';
	const bullet = level < 0 ? '' : (pipe + ' ').repeat(level) + dir;

	const renderedElement = document.createElement('div');
	
	const levelElement = document.createElement('span');
	renderedElement.appendChild(levelElement);
	levelElement.innerText = bullet;
	levelElement.classList.add('text-white');

	const iconElement = document.createElement('span');
	renderedElement.appendChild(iconElement);
	iconElement.classList.add('iconify', page.icon || 'noicon');

	const labelElement = document.createElement('span');
	renderedElement.appendChild(labelElement);
	labelElement.innerText = name;
	labelElement.classList.add('label');

	const childrenElement = document.createElement('div');
	renderedElement.appendChild(childrenElement);
	if (level >= 0) {
		childrenElement.classList.add('hidden');
	}

	if (name.endsWith('/')) {
		renderedElement.classList.add('text-blue-500');
	}

	else if (name.endsWith('.pdf')) {
		renderedElement.classList.add('text-purple-600');
	}

	else if (name.endsWith('.png') || name.endsWith('.flac')) {
		renderedElement.classList.add('text-yellow-500');
	}

	else if (name.endsWith('.bat')) {
		renderedElement.classList.add('text-lime-500');
	}

	else if (name.endsWith('.zip') || name.endsWith('.tar.gz')) {
		renderedElement.classList.add('text-red-500');
	}

	else if (name.endsWith('.desktop')) {
		renderedElement.classList.add('text-indigo-500');
	}

	else if (name.endsWith('.c')) {
		renderedElement.classList.add('text-cyan-500');
	}

	else if (name.endsWith('.txt') || name.endsWith('.MD')) {
		renderedElement.classList.add('text-green-500');
	} else {
		renderedElement.classList.add('text-white');
	}

	if (page.pages != undefined) {
		if (level >= 0) {
			labelElement.classList.add('false-link');

			labelElement.addEventListener('click', e => {
				childrenElement.classList.toggle('hidden');
				iconElement.classList.toggle('open');
			});
		}
		
		page.pages.forEach((subPage, i) => {
			subPage.html = document.createElement('span');
			subPage.html.innerText = subPage.display;
			renderPage(subPage, childrenElement, level+1, i == page.pages.length-1);
		});
	} else if (page.a != undefined) {
		labelElement.classList.add('false-link');
		labelElement.addEventListener('click', () => window.open(page.a, '_blank', 'noopener,noreferrer'));
	}

	if (page.hover != undefined) {
		labelElement.classList.add('hover-link');
		if (page.special == 'dragon') {
			labelElement.addEventListener('mouseover', () => showTooltip(page.hover + "<br/>" + randomDragonFact()));
		} else {
			labelElement.addEventListener('mouseover', () => showTooltip(page.hover) );
		}
		labelElement.addEventListener('mouseout', () => hideTooltip());
	}

	if (page.special == 'rewatch') {
		labelElement.classList.add('false-link');
		labelElement.addEventListener('click', () => {
			localStorage.removeItem('viewedIntro');
			location.reload();
		})
	}

	if (page.special == 'copy') {
		labelElement.addEventListener('click', () => navigator.clipboard.writeText('steg.gy'));
	}

	parent.appendChild(renderedElement);
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

const main = () => {

	loadMainSite("./src/pages.json");
	loadDragonFacts("./src/dragons.txt");
	if (localStorage['viewedIntro']) {
		showWebsite();
	} else {
		loadNeofetch('./src/neofetch.html');
		setTimeout(animateCommand, 1000, firstCommand, document.getElementById('website-command1'), showErrorCommand);
	}
	document.addEventListener('mousemove', e => moveTooltip(e));
}

window.onload = main;