import { defineNuxtModule } from "@nuxt/kit";
import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";

// Функция для генерации различных размеров изображений
function generateImageSizes(imagePath: string) {
	const sizes = [
		"40x40",
		"200x120",
		"384x230",
		"400x200",
		"400x300",
		"800x600",
		"1200x900",
		"768x576"
	];
	
	return sizes.map(size => `/_ipx/q_80&s_${size}${imagePath}`);
}

export default defineNuxtModule({
	meta: {
		name: "prerender-projects",
	},
	setup(_, nuxt) {
	// Добавляем маршруты проектов для prerender только при статической генерации
		nuxt.hook("nitro:config", async (config) => {
			if (config.preset === "static" || config.preset === "github_pages") {
				if (!config.prerender) {
					config.prerender = { routes: [] };
				}

				try {
					// Пути к директориям с проектами
					const projectsDir = join(process.cwd(), "content", "projects");
					const routes = new Set(config.prerender.routes);

					// Добавляем основные маршруты
					routes.add("/");
					routes.add("/projects");

					// Получаем список локалей
					const locales = ["en", "ru"]; // Явно указываем доступные локали

					for (const locale of locales) {
						const localeDir = join(projectsDir, locale);

						try {
							const projectFiles = await readdir(localeDir);

							for (const file of projectFiles) {
								if (file.endsWith(".md")) {
									const slug = basename(file, ".md");

									// Добавляем маршрут для каждого проекта
									routes.add(`/projects/${slug}`);

									// Добавляем маршруты с префиксами локалей
									routes.add(`/${locale}/projects/${slug}`);

									// Читаем содержимое файла для поиска фоновых изображений
									const filePath = join(localeDir, file);
									const content = await readFile(filePath, "utf-8");

									// Ищем backgroundImage в frontmatter
									const backgroundImageMatch = content.match(
										/backgroundImage:\s*['"]([^'"]+)['"]/
									);
									if (backgroundImageMatch && backgroundImageMatch[1]) {
										const backgroundImagePath = backgroundImageMatch[1];
										// Добавляем фоновое изображение и его обработанные версии
										routes.add(backgroundImagePath);
										
										// Генерируем и добавляем различные размеры изображений
										generateImageSizes(backgroundImagePath).forEach(sizeRoute => {
											routes.add(sizeRoute);
										});
									}

									// Ищем logo в frontmatter
									const logoMatch = content.match(
										/logo:\s*['"]([^'"]+)['"]/
									);
									if (logoMatch && logoMatch[1]) {
										const logoPath = logoMatch[1];
										// Добавляем логотип и его обработанные версии
										routes.add(logoPath);
										
										// Генерируем и добавляем различные размеры изображений
										generateImageSizes(logoPath).forEach(sizeRoute => {
											routes.add(sizeRoute);
										});
									}

									// Добавляем изображения проекта для прегенерации
									const projectLogoPath = `/projects/${slug}/logo.svg`;
									routes.add(projectLogoPath);
									
									// Генерируем и добавляем различные размеры изображений
									generateImageSizes(projectLogoPath).forEach(sizeRoute => {
										routes.add(sizeRoute);
									});

									// Также ищем изображения в галерее
									const galleryMatch = content.match(
										/gallery:\s*\[([\s\S]*?)\]/
									);
									if (galleryMatch && galleryMatch[1]) {
										// Извлекаем пути к изображениям из галереи
										const galleryContent = galleryMatch[1];
										const imagePaths = galleryContent.match(
											/['"]([^'"]+\.(png|jpe?g|webp|gif|svg))['"]/gi
										);
										if (imagePaths) {
											for (const imagePath of imagePaths) {
												const cleanPath = imagePath.replace(/['"]/g, "").trim();
												if (cleanPath.startsWith("/")) {
													routes.add(cleanPath);
													
													// Генерируем и добавляем различные размеры изображений
													generateImageSizes(cleanPath).forEach(sizeRoute => {
														routes.add(sizeRoute);
													});
												}
											}
										}
									}

									// Ищем используемые технологии в проекте для прегенерации иконок
									const technologiesMatch = content.match(
										/technologies:\s*\[([\s\S]*?)\]/
									);
									if (technologiesMatch && technologiesMatch[1]) {
										const technologiesContent = technologiesMatch[1];
										const techSlugs =
											technologiesContent.match(/['"]([^'"]+)['"]/g);
										if (techSlugs) {
											for (const techSlug of techSlugs) {
												const cleanSlug = techSlug.replace(/['"]/g, "").trim();

												// Добавляем иконки технологий из useTagIcons
												// Эти иконки могут быть в формате simple-icons:IconName или /icons/icon.svg
												// Приведем slug к формату, используемому в useTagIcons
												const normalizedSlug = cleanSlug
													.toLowerCase()
													.replace(/[^a-z0-9]/g, "");

												// Проверим, есть ли в useTagIcons иконки для этой технологии
												// и добавим их в прегенерацию, если они используют пути к файлам
												if (normalizedSlug === "figma") {
													const iconPath = "/icons/Figma-logo.svg";
													routes.add(iconPath);
													// Генерируем и добавляем различные размеры изображений
													generateImageSizes(iconPath).forEach(sizeRoute => {
														routes.add(sizeRoute);
													});
												} else if (normalizedSlug === "gemini") {
													const iconPath = "/icons/gemini.svg";
													routes.add(iconPath);
													// Генерируем и добавляем различные размеры изображений
													generateImageSizes(iconPath).forEach(sizeRoute => {
														routes.add(sizeRoute);
													});
												} else if (normalizedSlug === "lucide") {
													const iconPath = "/icons/lucide.svg";
													routes.add(iconPath);
													// Генерируем и добавляем различные размеры изображений
													generateImageSizes(iconPath).forEach(sizeRoute => {
														routes.add(sizeRoute);
													});
												} else if (
													normalizedSlug === "openai" ||
													normalizedSlug === "chatgpt" ||
													normalizedSlug === "sora"
												) {
													const iconPath = "/icons/openai.svg";
													routes.add(iconPath);
													// Генерируем и добавляем различные размеры изображений
													generateImageSizes(iconPath).forEach(sizeRoute => {
														routes.add(sizeRoute);
													});
												}
											}
										}
									}
								}
							}
						} catch (error) {
							console.warn(
								`Не удалось прочитать директорию проектов для локали ${locale}:`,
								error
							);
						}
					}

					config.prerender.routes = Array.from(routes);
				} catch (error) {
					console.warn(
						"Не удалось получить список проектов для prerender:",
						error
					);
				}
			}
		});
	},
});
