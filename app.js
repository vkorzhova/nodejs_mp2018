import config from './config';
import { Product, User } from './models';
import { DirWatcher, Importer } from './services';

console.log(`The name of application: ${config.name}`);

new Product();
new User();

const dirWatcher = new DirWatcher('./data', 5000);
dirWatcher.watch();

const importer = new Importer();

dirWatcher.on('dirwatcher:changed', async(state) => {
  const csvData = [];

  // processing only modified files
  for await (const filePath of state.modified) {
    // const data = importer.importSync(filePath);
    const data = await importer.import(filePath);
    csvData.push(data);
  };

  console.log(csvData);
});
