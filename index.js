require('dotenv').config();
    const schedule = require('node-schedule');
    const logger = require('./logger');
    const { fetchWebsiteContent, extractChapterInfo } = require('./scraper');
    const { sendDiscordNotification } = require('./notifier');
    const config = require('./config.json');

    let lastProcessedChapters = {};
    let lastNotificationTime = 0;

    async function processSite(site) {
      logger.info(`Checking for new chapters on: ${site.name}`);
      const html = await fetchWebsiteContent(site.url);
      if (!html) return;

      const chapters = extractChapterInfo(html);

      for (const chapter of chapters) {
        const { seriesTitle, chapterNumber } = chapter;
        if (
          !lastProcessedChapters[site.name] ||
          !lastProcessedChapters[site.name][seriesTitle] ||
          parseInt(chapterNumber) > parseInt(lastProcessedChapters[site.name][seriesTitle])
        ) {
          const now = Date.now();
          if (now - lastNotificationTime >= config.notificationInterval) {
            await sendDiscordNotification(
              site.discordWebhookUrl,
              site.allWorksRole,
              seriesTitle,
              chapterNumber
            );
            lastNotificationTime = now;
          } else {
            logger.info(
              `Notification for ${seriesTitle} chapter ${chapterNumber} delayed due to rate limiting.`
            );
          }

          if (!lastProcessedChapters[site.name]) {
            lastProcessedChapters[site.name] = {};
          }
          lastProcessedChapters[site.name][seriesTitle] = chapterNumber;
        }
      }
      logger.info(`Finished checking for new chapters on: ${site.name}`);
    }

    async function checkNewChapters() {
      for (const site of config.sites) {
        await processSite(site);
      }
    }

    schedule.scheduleJob(config.scheduleInterval, checkNewChapters);

    logger.info('Chapter notifier started. Checking for new chapters based on the schedule.');
