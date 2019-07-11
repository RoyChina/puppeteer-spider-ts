///<refrence path="./tasks/task.d.ts" />;
import puppeteer from "puppeteer";
import batchTasks from "./batchTasks";
import f from "tasks";
import fs from "fs";
import path from "path";
const { WakeLock } = require("wake-lock");

async function main(params: void) {
  // keep system running when run the spider
  const lock = new WakeLock("Keep spider running!");

  const parallelCount = 10;
  const eachTaskTimeout = () => Math.random() * 200 + 100;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: [
      "--disable-infobars", // hide “Chrome is being controlled by automated test software”
      "--window-size=1790,1080",
      "--enable-automation"
    ],
    devtools: false
  });

  const tasks: Task<object>[] = [
    require(path.resolve(__dirname, "./tasks/district")),
    require(path.resolve(__dirname, "./tasks/area")),
    require(path.resolve(__dirname, "./tasks/page")),
    require(path.resolve(__dirname, "./tasks/sold"))
  ];

  const results = await batchTasks(
    tasks,
    browser,
    parallelCount,
    eachTaskTimeout
  );

  console.log("任务结束", results);
  await browser.close();

  lock.release();
}

main();
