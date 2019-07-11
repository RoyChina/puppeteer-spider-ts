import { Browser, Page } from "puppeteer";
import { queue, AsyncQueue } from "async";
import path from "path";

const batchTasks = async (
  tasks: Task<any>[],
  browser: Browser,
  parallelCount: number = 1,
  timeout: { (): number }
) => {
  const results: TaskResult[][] = [];
  const q = queue(
    async (
      { deep, prevOutput, prevPath }: TaskQueueArgs<object>,
      callback: VoidFunction
    ) => {
      const currentTask = tasks[deep];
      if (!currentTask) {
        // results.push(prevPath);
        return callback();
      }
      const {
        name,
        selector,
        gather,
        getInputUrl = (result: TaskResult, prevPath: TaskResult[]) =>
          result.url,
        getOutputs = (gatherResult: any): TaskResult[] => gatherResult,
        effect
      } = currentTask;
      const url = getInputUrl(prevOutput, prevPath);

      const gatherResult = await tryToExcute(url, selector, gather, browser);

      const taskResults = getOutputs(gatherResult, prevPath, name);

      await effect(taskResults, prevPath, name);

      runTasks(taskResults, deep, prevPath, q);
      setTimeout(() => {
        callback();
      }, timeout());
    },
    parallelCount
  );

  if (!tasks[0].seeds) {
    throw "You must give some seeds for your fist taks!";
  }
  runTasks(tasks[0].seeds, -1, [], q);
  await q.drain();
  return results;
};

const runTasks = (
  taskResults: TaskResult[],
  deep: number,
  prevPath: TaskResult[],
  q: AsyncQueue<TaskQueueArgs<object>>
) => {
  taskResults.forEach(taskResult => {
    const newPath = [...prevPath, taskResult];
    const newDeep = deep + 1;
    q.push({
      deep: newDeep,
      prevPath: newPath,
      prevOutput: taskResult
    });
  });
};

const excute = async (
  url: string,
  selector: string,
  gather: gatherFunc<object>,
  browser: Browser,
  page: Page
): Promise<GatherResult> => {
  await page.goto(url);
  await page.addScriptTag({
    path: path.resolve(__dirname, "./lib/jquery-3.4.1.min.js")
  });
  if (selector) {
    await page.waitForSelector(selector);
  }
  const result = await page.evaluate(gather);
  page.close();
  return result;
};

const tryToExcute = async (
  url: string,
  selector: string,
  gather: gatherFunc<object>,
  browser: Browser
) => {
  const page = await browser.newPage();
  let result: GatherResult | boolean = false,
    retryTime = 0;
  while (!result && retryTime < 5) {
    if (retryTime > 0) {
      console.log(`任务失败，重新尝试执行 ${retryTime}/5 ...`);
    }
    result = await Promise.race([
      excute(url, selector, gather, browser, page),
      rejectTimeout(13000)
    ]).catch(error => {
      console.log(error);
      return false;
    });
    retryTime++;
  }

  page.close();
  return result;
};

const rejectTimeout = (timeout: number): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(false);
    }, timeout);
  });
};

export default batchTasks;
