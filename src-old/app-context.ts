const config: { [s: string]: any } = {};
const dependencies: { [s: string]: Promise<any> } = {};
const resolvers: { [s: string]: Function } = {};

const getOrCreatePromise = <T = any>(name: string): Promise<T> => {
  if (!dependencies[name]) {
    dependencies[name] = new Promise<T>(
      resolve => (resolvers[name] = resolve)
    );
  }
  return dependencies[name];
}

const getDependency = <T = any>(name: string): Promise<T> => {
  return getOrCreatePromise<T>(name);
};

export const AppContext = {
  set: <T = any>(name: string, value: T) => (config[name] = value),
  get: <T = any>(name: string): T => config[name],
  require: <T = any>(name: string): Promise<T> => getDependency(name),
  provide: <T = any>(name: string, value: T): void => {
    void getOrCreatePromise<T>(name);
    if (resolvers[name]) {
      resolvers[name](value);
    }
  }
};
