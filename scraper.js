const axios = require('axios');
    const cheerio = require('cheerio');
    const logger = require('./logger');

    async function fetchWebsiteContent(url) {
      try {
        logger.info(`Fetching website content from: ${url}`);
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        logger.error(`Error fetching website content from ${url}: ${error.message}`);
        return null;
      }
    }

    function extractChapterInfo(html) {
      const $ = cheerio.load(html);
      const chapters = [];

      $('.eplister > ul > li').each((i, el) => {
          const seriesTitle = $(el).find('.series').text().trim();
          const chapterElement = $(el).find('.chapter a');
          const chapterTitle = chapterElement.attr('title').trim();
          const chapterNumberMatch = chapterTitle.match(/Capítulo (\d+)/);
          const chapterNumber = chapterNumberMatch ? chapterNumberMatch[1] : null;

          if (seriesTitle && chapterNumber) {
              chapters.push({ seriesTitle, chapterNumber });
          }
      });
      return chapters;
    }

    module.exports = { fetchWebsiteContent, extractChapterInfo };
