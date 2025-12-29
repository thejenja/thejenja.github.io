import { defineNuxtModule } from '@nuxt/kit'
import { readdir, readFile } from 'fs/promises'
import { join, basename } from 'path'

export default defineNuxtModule({
  meta: {
    name: 'prerender-projects',
  },
  setup(_, nuxt) {
    // Добавляем маршруты проектов для prerender только при статической генерации
    nuxt.hook('nitro:config', async (config) => {
      if (config.preset === 'static' || config.preset === 'github_pages') {
        if (!config.prerender) {
          config.prerender = { routes: [] }
        }
        
        try {
          // Пути к директориям с проектами
          const projectsDir = join(process.cwd(), 'content', 'projects')
          const routes = new Set(config.prerender.routes)
          
          // Добавляем основные маршруты
          routes.add('/')
          routes.add('/projects')
          
          // Получаем список локалей
          const locales = ['en', 'ru'] // Явно указываем доступные локали
          
          for (const locale of locales) {
            const localeDir = join(projectsDir, locale)
            
            try {
              const projectFiles = await readdir(localeDir)
              
              for (const file of projectFiles) {
                if (file.endsWith('.md')) {
                  const slug = basename(file, '.md')
                  
                  // Добавляем маршрут для каждого проекта
                  routes.add(`/projects/${slug}`)
                  
                  // Добавляем маршруты с префиксами локалей
                  routes.add(`/${locale}/projects/${slug}`)
                  
                  // Читаем содержимое файла для поиска фоновых изображений
                  const filePath = join(localeDir, file)
                  const content = await readFile(filePath, 'utf-8')
                  
                  // Ищем backgroundImage в frontmatter
                  const backgroundImageMatch = content.match(/backgroundImage:\s*['"]([^'"]+)['"]/)
                  if (backgroundImageMatch) {
                    const backgroundImagePath = backgroundImageMatch[1]
                    // Добавляем фоновое изображение и его обработанные версии
                    routes.add(backgroundImagePath)
                    routes.add(`/_ipx/q_80&s_400x300${backgroundImagePath}`)
                    routes.add(`/_ipx/q_80&s_800x600${backgroundImagePath}`)
                    routes.add(`/_ipx/q_80&s_1200x900${backgroundImagePath}`)
                  }
                  
                  // Добавляем изображения проекта для прегенерации
                  routes.add(`/projects/${slug}/logo.svg`)
                  routes.add(`/_ipx/q_80&s_384x230/projects/${slug}/logo.svg`)
                  routes.add(`/_ipx/q_80&s_400x200/projects/${slug}/logo.svg`)
                  routes.add(`/_ipx/q_80&s_200x120/projects/${slug}/logo.svg`)
                  
                  // Также ищем изображения в галерее
                  const galleryMatch = content.match(/gallery:\s*\[([\s\S]*?)\]/)
                  if (galleryMatch) {
                    // Извлекаем пути к изображениям из галереи
                    const galleryContent = galleryMatch[1]
                    const imagePaths = galleryContent.match(/['"]([^'"]+\.(png|jpe?g|webp|gif))['"]/gi)
                    if (imagePaths) {
                      for (const imagePath of imagePaths) {
                        const cleanPath = imagePath.replace(/['"]/g, '').trim()
                        if (cleanPath.startsWith('/')) {
                          routes.add(cleanPath)
                          routes.add(`/_ipx/q_80&s_400x300${cleanPath}`)
                          routes.add(`/_ipx/q_80&s_800x600${cleanPath}`)
                        }
                      }
                    }
                  }
                  
                  // Ищем используемые технологии в проекте для прегенерации иконок
                  const technologiesMatch = content.match(/technologies:\s*\[([\s\S]*?)\]/)
                  if (technologiesMatch) {
                    const technologiesContent = technologiesMatch[1]
                    const techSlugs = technologiesContent.match(/['"]([^'"]+)['"]/g)
                    if (techSlugs) {
                      for (const techSlug of techSlugs) {
                        const cleanSlug = techSlug.replace(/['"]/g, '').trim()
                        
                        // Добавляем иконки технологий из useTagIcons
                        // Эти иконки могут быть в формате simple-icons:IconName или /icons/icon.svg
                        // Приведем slug к формату, используемому в useTagIcons
                        const normalizedSlug = cleanSlug.toLowerCase().replace(/[^a-z0-9]/g, '')
                        
                        // Проверим, есть ли в useTagIcons иконки для этой технологии
                        // и добавим их в прегенерацию, если они используют пути к файлам
                        if (normalizedSlug === 'figma') {
                          routes.add('/icons/Figma-logo.svg')
                        } else if (normalizedSlug === 'gemini') {
                          routes.add('/icons/gemini.svg')
                        } else if (normalizedSlug === 'lucide') {
                          routes.add('/icons/lucide.svg')
                        } else if (normalizedSlug === 'openai' || normalizedSlug === 'chatgpt' || normalizedSlug === 'sora') {
                          routes.add('/icons/openai.svg')
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.warn(`Не удалось прочитать директорию проектов для локали ${locale}:`, error)
            }
          }
          
          config.prerender.routes = Array.from(routes)
        } catch (error) {
          console.warn('Не удалось получить список проектов для prerender:', error)
        }
      }
    })
  }
})