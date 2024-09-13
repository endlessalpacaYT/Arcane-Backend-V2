const { itemStorageService, logger } = require("../..");
const { ShopHelper } = require("../helpers/shophelper");
const { ShopGenerator } = require("../shop");
const cron = require("node-cron");

async function rotate() {
  logger.info("Waiting for storefront generation.");

  cron.schedule(
    "0 17 * * *",
    async () => {
      await ShopGenerator.generate();
      const nextRun = new Date();
      nextRun.setHours(17, 0, 0, 0);
      nextRun.setDate(nextRun.getDate() + 1);

      logger.info(`Next shop generates at ${nextRun}`);
      logger.info("Successfully generated storefront.");

      await itemStorageService.addItems([
        {
          data: ShopHelper.getCurrentShop(),
          type: "storefront",
        },
      ]);
    },
    {
      timezone: "America/Phoenix",
    }
  );
}

module.exports = rotate;
