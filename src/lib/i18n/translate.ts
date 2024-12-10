import ollama from 'ollama';
import { defaultLocale, locales } from './locales';
import fs from 'fs/promises';

export const translate = async (locale: string, input: string, model = 'llama3.1') => {
	const response = await ollama.chat({
		model,
		format: 'json',
		messages: [
			{
				role: 'system',
				content: `You are a language translation assistant specializing in software localization. Your task is to translate the given JSON-formatted dictionary into the specified locale while ensuring the following guidelines are met:
    Context Preservation: Retain the original meaning and intent of each key-value pair. For example, user interface terms like "login" or "submit" should align with typical usage in the target language for software applications.
    Locale-Specific Accuracy: Adapt phrases to match cultural nuances, idiomatic expressions, and technical conventions in the target locale. For example, "privacy" might require context-specific adaptation for formal or legal terms in some languages.
    Non-Alteration of Keys: Leave JSON keys unchanged (e.g., "admin", "login") and translate only the values.
    Formatting Integrity: Maintain the JSON structure, with all keys directly under the root object, ensuring proper syntax and escaping any special characters as required for JSON compatibility.
    Consistent Tone: Use a formal and professional tone where necessary unless the context clearly indicates a casual style (e.g., "hero.title" and "hero.description" may allow for a more creative tone).
    Language-Specific Rules: Follow the grammar, punctuation, and capitalization rules of the target language.
    About the app: Kreacon is a platform for showcasing, competing and voting on creative submissions.`
			},
			{ role: 'user', content: `locale: ${locale}\ninput: ${input}` }
		]
	});
	return JSON.parse(response.message.content);
};

const input = JSON.stringify(await locales[defaultLocale]());
for (const locale of Object.keys(locales).filter((l) => l !== defaultLocale)) {
	const result = await translate(locale, input, 'llama3.1');
	console.log(`${locale}:`, result);
	await fs.writeFile(`./src/lib/i18n/locales/${locale}.json`, JSON.stringify(result, null, 2));
}

export default translate;
