export const useMarkParser = () => {
	// Парсер: заменяет **...** на <mark>...</mark>
	const parseMarkdown = (text: string): string => {
		if (!text || typeof text !== "string") return text;
		return text.replace(/\*\*(.+?)\*\*/g, "<mark>$1</mark>");
	};

	// Парсер для массива строк
	const parseMarkdownArray = (texts: string[]): string[] => {
		return texts.map((text) => parseMarkdown(text));
	};

	// Парсер для объекта с локализацией
	const parseMarkdownObject = (
		obj: Record<string, any>
	): Record<string, any> => {
		const result: Record<string, any> = {};

		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === "string") {
				result[key] = parseMarkdown(value);
			} else if (typeof value === "object" && value !== null) {
				result[key] = parseMarkdownObject(value);
			} else {
				result[key] = value;
			}
		}

		return result;
	};

	return {
		parseMarkdown,
		parseMarkdownArray,
		parseMarkdownObject,
	};
};
