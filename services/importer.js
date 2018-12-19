import * as fs from 'fs';
import * as papa from 'papaparse';

export class Importer {
  async import(filePath) {
    try {
      return new Promise((resolve) => {
        papa.parse(fs.createReadStream(filePath, 'utf8'), {
          complete: (results) => {
            resolve({ filePath, data: results.data });
          }
        });
      });
    } catch (error) {
      throw new Error(`Error occurs while async importing file(${filePath}): ${error}`);
    }
  }

  importSync(filePath) {
    try {
      const data = fs.readFileSync(filePath, { encoding: 'utf-8' });

      return { filePath, data: papa.parse(data).data };
    } catch (error) {
      throw new Error(`Error occurs while importing file(${filePath}): ${error}`);
    }
  }
}
