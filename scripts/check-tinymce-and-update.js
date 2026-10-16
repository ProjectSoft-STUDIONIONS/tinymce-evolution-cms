// scripts/check-tinymce-and-update.js
const fs = require('fs');
const path = require('path');

const packageName = 'tinymce';
const jsonPath = path.join(__dirname, '..', 'tinymce-accepted-tags.json');
const pkgPath = path.join(__dirname, '..', 'package.json');

function compareVersions(a, b) {
	const partsA = a.split('.').map(Number);
	const partsB = b.split('.').map(Number);
	const len = Math.max(partsA.length, partsB.length);
	for (let i = 0; i < len; i++) {
		const va = partsA[i] ?? 0;
		const vb = partsB[i] ?? 0;
		if (va > vb) return 1;
		if (va < vb) return -1;
	}
	return 0;
}

function bumpPatchVersion(version) {
	// Увеличиваем патч-версию: 1.2.3 -> 1.2.4
	const [major, minor, patch = '0'] = version.split('.');
	const newPatch = parseInt(patch, 10) + 1;
	return `${major}.${minor}.${newPatch}`;
}

async function main() {
	// Читаем текущие принятые версии tinymce
	let acceptedTags = {};
	if (fs.existsSync(jsonPath)) {
		acceptedTags = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
	} else {
		console.error('Файл tinymce-accepted-tags.json не найден!');
		process.exit(1);
	}

	// Получаем актуальные dist-tags tinymce из npm
	const url = `https://registry.npmjs.org/${packageName}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	const currentTags = data['dist-tags'] || {};

	let anyUpdate = false;

	// Проверяем все теги: если хоть один изменился — это повод для релиза
	for (const [tag, currentVersion] of Object.entries(currentTags)) {
		const acceptedVersion = acceptedTags[tag];

		// Если тега раньше не было ИЛИ версия выросла — считаем, что есть обновление
		if (!acceptedVersion || compareVersions(currentVersion, acceptedVersion) > 0) {
			console.log(`[UPDATE] Тег "${tag}": было "${acceptedVersion}" → стало "${currentVersion}"`);
			acceptedTags[tag] = currentVersion; // Обновляем JSON с принятыми тегами
			anyUpdate = true;
		}
	}

	if (!anyUpdate) {
		console.log('Обновлений в тегах tinymce не найдено.');
		writeOutput('updated', 'false');
		return;
	}

	console.log('Обнаружено обновление tinymce — увеличиваем версию проекта и готовим релиз.');

	// Обновляем tinymce-accepted-tags.json
	fs.writeFileSync(jsonPath, JSON.stringify(acceptedTags, null, 2), 'utf8');

	// Работаем с package.json: читаем, увеличиваем патч-версию, пишем обратно
	let pkg;
	if (fs.existsSync(pkgPath)) {
		pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	} else {
		console.error('package.json не найден!');
		process.exit(1);
	}

	const oldVersion = pkg.version;
	const newVersion = bumpPatchVersion(oldVersion);

	console.log(`Версия проекта: ${oldVersion} → ${newVersion}`);
	pkg.version = newVersion;
	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');

	writeOutput('updated', 'true');
	writeOutput('new-version', newVersion);
}

// Правильный вывод для GitHub Actions (совместимо с современными раннерами)
function writeOutput(name, value) {
	if (process.env.GITHUB_OUTPUT) {
		fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`, { encoding: 'utf8' });
	} else {
		// Фоллбэк для старых раннеров
		console.log(`::set-output name=${name}::${value}`);
	}
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
