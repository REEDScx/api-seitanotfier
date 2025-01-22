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

      $('.list-chapter > li').each((i, el) => {
        const titleElement = $(el).find('.chapter a');
        const title = titleElement.attr('title').trim();
        const chapterNumberMatch = title.match(/Capítulo (\d+)/);
        const chapterNumber = chapterNumberMatch ? chapterNumberMatch[1] : null;
        const seriesTitle = $(el).closest('.list-chapter').prev('h4').text().trim();

        if (chapterNumber) {
          chapters.push({ seriesTitle, chapterNumber });
        }
      });
      return chapters;
    }

    module.exports = { fetchWebsiteContent, extractChapterInfo };
