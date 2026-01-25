// scripts/content-sync.js
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import matter from "gray-matter";

const CONFIG = {
	projectsDir: "content/projects",
	primaryLang: "ru",
	targetLang: "en",
	todoComment: "TODO: TRANSLATE THIS FILE",
};

async function run() {
	const baseDir = path.join(process.cwd(), CONFIG.projectsDir);
	const primaryDir = path.join(baseDir, CONFIG.primaryLang);
	const targetDir = path.join(baseDir, CONFIG.targetLang);

	console.log(
		chalk.blue(
			`🔄 Syncing content: ${CONFIG.primaryLang} <-> ${CONFIG.targetLang}`,
		),
	);

	// Проверка существования папок
	if (!fs.existsSync(primaryDir)) {
		console.error(chalk.red(`❌ Directory not found: ${primaryDir}`));
		return;
	}
	if (!fs.existsSync(targetDir)) {
		// Можно создать папку, если её нет
		console.log(
			chalk.yellow(`⚠️ Directory not found: ${targetDir}. Creating...`),
		);
		fs.ensureDirSync(targetDir);
	}

	const getFiles = (dir) =>
		fs
			.readdirSync(dir)
			.filter(
				(f) => f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".yml"),
			);

	const primaryFiles = getFiles(primaryDir);
	const targetFiles = getFiles(targetDir);

	// 1. Проверяем чего нет в Target
	primaryFiles.forEach((file) => {
		if (!targetFiles.includes(file)) {
			syncFile(
				file,
				primaryDir,
				targetDir,
				CONFIG.primaryLang,
				CONFIG.targetLang,
			);
		}
	});

	// 2. Проверяем чего нет в Primary
	targetFiles.forEach((file) => {
		if (!primaryFiles.includes(file)) {
			syncFile(
				file,
				targetDir,
				primaryDir,
				CONFIG.targetLang,
				CONFIG.primaryLang,
			);
		}
	});

	console.log(chalk.green("✨ Sync complete."));
}

async function syncFile(filename, sourceDir, destDir, sourceLang, destLang) {
	const srcPath = path.join(sourceDir, filename);
	const destPath = path.join(destDir, filename);

	console.log(
		chalk.yellow(
			`➕ Missing in /${destLang}: ${filename}. Copying from /${sourceLang}...`,
		),
	);

	const rawContent = await fs.readFile(srcPath, "utf8");

	if (filename.endsWith(".md")) {
		const parsed = matter(rawContent);

		parsed.data.translationStatus = "pending";
		parsed.data.originalLang = sourceLang;

		const comment = `\n\n\n\n`;

		// В gray-matter stringify принимает (content, data), а не наоборот как иногда думают
		const newContent = matter.stringify(comment + parsed.content, parsed.data);

		await fs.outputFile(destPath, newContent);
	} else {
		await fs.copy(srcPath, destPath);
	}
}

run();
