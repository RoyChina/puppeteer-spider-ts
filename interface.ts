interface Task<T> {
  name: string;
  selector: string;
  getInputUrl: getInputUrlFunc;
  gather: gatherFunc<T>;
  getOutputs?: getOutputsFunc<T>;
  effect: effectFunc<T>;
  timeout?: number;
  seeds?: TaskResult[]; // when the task is the first task, this shoud not be empty
}

interface TaskResult {
  url: string;
  data?: any;
  name?: string; // use in path dsiplay
}

interface TaskQueueArgs<T> {
  deep: number;
  prevOutput: TaskResult;
  prevPath: TaskResult[];
}

interface getInputUrlFunc {
  (prevOutput?: TaskResult, path?: TaskResult[]): string;
}

interface getOutputsFunc<T> {
  (gatherResult: T, path: TaskResult[], name: string): TaskResult[];
}

interface gatherFunc<T> {
  (): T;
}

interface effectFunc<T> {
  (gatherResult: T, path: TaskResult[], name: string): void;
}

interface GatherResult extends Object {}
