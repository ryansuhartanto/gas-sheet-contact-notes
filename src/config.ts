interface Config {
  includeHeader: boolean;
  key: "name" | "email" | "phone";
  separator: string;
}

const defaultConfig: Config = {
  includeHeader: false,
  key: "email",
  separator: "\n",
};

let config = defaultConfig;

function setConfig(newConfig: Partial<Config>) {
  config = {
    ...config,
    ...newConfig,
  };
}
