const axios = require('axios');
    const logger = require('./logger');

    async function sendDiscordNotification(webhookUrl, allWorksRole, seriesTitle, chapterNumber) {
      const content = `${allWorksRole} @${seriesTitle} ${chapterNumber}`;
      try {
        await axios.post(webhookUrl, { content });
        logger.info(`Notification sent to Discord: ${content}`);
      } catch (error) {
        logger.error(`Error sending notification to Discord: ${error.message}`);
      }
    }

    module.exports = { sendDiscordNotification };
