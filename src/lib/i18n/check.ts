/*
 * Mostly proompted, I take no credit for this code,
 * I just wanted a quick way to check if the translations are present.
 */
// TODO Check that translations has all keys of defaultLocale
import * as fs from 'fs';
import * as path from 'path';
import { defaultLocale, locales } from './locales';
import snakeCase from 'lodash/snakeCase';
import groupBy from 'object.groupby';

interface TranslationEntry {
	key: string;
	path: string;
	value: string;
}

const defaultLocaleJson = await locales[defaultLocale]();

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';

const getAllFiles = async (dirPath: string, arrayOfFiles: string[] = []) => {
	const files = fs.readdirSync(dirPath);

	for (const file of files) {
		const fullPath = path.join(dirPath, file);

		if (fs.statSync(fullPath).isDirectory()) {
			arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
		} else {
			if (/\.(svelte|ts|js)$/.test(fullPath)) {
				arrayOfFiles.push(fullPath);
			}
		}
	}

	return arrayOfFiles;
};

const findTranslationsInFile = (filePath: string) => {
	const content = fs.readFileSync(filePath, 'utf-8');
	const translationRegex = /\$t\(['"]([^'"]+)['"]\)/g;
	const results = {
		translations: new Set<TranslationEntry>(),
		missingTranslations: new Set<TranslationEntry>()
	};

	let match;
	while ((match = translationRegex.exec(content)) !== null) {
		const key = match[1];
		const snakeKey = snakeCase(key);
		const entry: TranslationEntry = {
			value: key,
			key: snakeKey,
			path: path.relative(process.cwd(), filePath)
		};

		if (!(snakeKey in defaultLocaleJson)) {
			results.missingTranslations.add(entry);
		} else {
			results.translations.add(entry);
		}
	}

	return results;
};

const printHeader = (text: string) => {
	const line = '='.repeat(text.length);
	console.log(line);
	console.log(text);
	console.log(line);
	console.log();
};

const printSection = (title: string) => {
	console.log(title);
	console.log('-'.repeat(title.length));
};

const formatSuggestion = (missingTranslations: Set<TranslationEntry>): string => {
	const suggestions = Object.fromEntries([...missingTranslations].map((t) => [t.key, t.value]));

	return JSON.stringify(suggestions, null, 2);
};

const formatTranslationEntries = (
	entries: Record<string, TranslationEntry[]>,
	symbol: '✔' | '✖'
): string => {
	const coloredSymbol = symbol === '✔' ? `${GREEN}${symbol}${RESET}` : `${RED}${symbol}${RESET}`;

	return Object.entries(entries)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(
			([key, entries]) =>
				`${coloredSymbol} ${key}\n  - ${entries
					?.map((e) => e.path)
					.sort()
					.join('\n  - ')}`
		)
		.join('\n');
};

const findTranslationUsage = async () => {
	const files = await getAllFiles('src');
	const allResults = files.reduce(
		(acc, file) => {
			const fileResults = findTranslationsInFile(file);
			fileResults.translations.forEach((t) => acc.translations.add(t));
			fileResults.missingTranslations.forEach((t) => acc.missingTranslations.add(t));
			return acc;
		},
		{
			translations: new Set<TranslationEntry>(),
			missingTranslations: new Set<TranslationEntry>()
		}
	);

	printHeader('Localization Report: Translation Check');

	const groupedTranslations = groupBy([...allResults.translations], ({ key }) => key);

	printSection('Found Translations:');
	console.log(formatTranslationEntries(groupedTranslations, '✔'));
	console.log();

	if (allResults.missingTranslations.size > 0) {
		printSection('Missing Translations:');
		const groupedMissingTranslations = groupBy(
			[...allResults.missingTranslations],
			({ key }) => key
		);
		console.log(formatTranslationEntries(groupedMissingTranslations, '✖'));
		console.log();
	}

	printSection('Summary:');
	const totalTranslations = allResults.translations.size + allResults.missingTranslations.size;
	const coveragePercentage = ((allResults.translations.size / totalTranslations) * 100).toFixed(1);
	console.log(`${GREEN}✔${RESET} Found Translations: ${allResults.translations.size}`);
	console.log(`${RED}✖${RESET} Missing Translations: ${allResults.missingTranslations.size}`);
	const coverageColor =
		Number(coveragePercentage) === 100 ? GREEN : Number(coveragePercentage) >= 75 ? YELLOW : RED;
	console.log(`○ Coverage: ${coverageColor}${coveragePercentage}%${RESET}`);
	console.log();

	if (allResults.missingTranslations.size > 0) {
		printSection('Suggestions:');
		console.log(formatSuggestion(allResults.missingTranslations));
	}
};

findTranslationUsage().catch(console.error);
