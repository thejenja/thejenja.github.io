import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Определяем локаль из параметров запроса или заголовков
 const query = getQuery(event)
  const locale = query.locale?.toString() || 'en'
  
  // Импортируем queryContent для получения данных из content
  const { queryContent } = await import('#content/server')
  
  try {
    // Получаем количество проектов для отображения в OG-изображении
    let projectsCount = 0
    
    if (locale === 'ru') {
      const ruProjects = await queryContent('projects/ru').find()
      projectsCount = ruProjects.length
    } else {
      const enProjects = await queryContent('projects/en').find()
      projectsCount = enProjects.length
    }
    
    // Возвращаем данные для OG-изображения в зависимости от локали
    if (locale === 'ru') {
      return {
        title: 'Проекты - Eugene (thejenja) Портфолио',
        description: 'Просмотрите мою коллекцию веб-разработок',
        projectCount: projectsCount,
      }
    } else {
      return {
        title: 'Projects - Eugene (thejenja) Portfolio',
        description: 'Explore my collection of web development projects',
        projectCount: projectsCount,
      }
    }
  } catch (error) {
    // В случае ошибки возвращаем заглушку
    console.error('Error loading projects for OG image:', error)
    return {
      title: 'Projects - Eugene (thejenja) Portfolio',
      description: 'Explore my collection of web development projects',
      projectCount: 0,
    }
  }
})