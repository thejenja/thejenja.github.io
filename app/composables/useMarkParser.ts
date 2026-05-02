export const useMarkParser = () => {
	// Парсер: заменяет **...** на <mark>...</mark>
	const parseMarkdown = (text: string): string => {
		if (!text || typeof text !== "string") return text;
		return text.replace(/\*\*(.+?)\*\*/g, "<mark>$1</mark>");
	};

	// Парсер для объекта с локализацией
	const parseMarkdownObject = (
		obj: Record<string, unknown>
	): Record<string, unknown> => {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === "string") {
				result[key] = parseMarkdown(value);
			} else if (typeof value === "object" && value !== null) {
				result[key] = parseMarkdownObject(value as Record<string, unknown>);
			} else {
				result[key] = value;
			}
		}

		return result;
	};

	return {
		parseMarkdown,
		parseMarkdownObject,
	};
};
