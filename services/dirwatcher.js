import { EventEmitter } from 'events';
import * as fs from 'fs';
import _ from 'lodash';
import * as path from 'path';
import { promisify } from 'util';

export class DirWatcher extends EventEmitter {
  constructor(folderPath, delay) {
    super();
    this.delay = delay;
    this.folderPath = folderPath;
    this.folderState = {};

    this.modifiedFiles = [];
    this.removedFiles = [];
  }

  async watch() {
    const readDirAsync = promisify(fs.readdir);
    const statAsync = promisify(fs.stat);

    const readFolder = async () => {
      await readDirAsync(this.folderPath)
        .then((files) => {
          // find deleted files and delete them from state
          this.removedFiles = Object.keys(this.folderState)
            .filter(filePath => !files.includes(filePath))
            .map((filePath) => {
              delete this.folderState[filePath];
              return this.getFullFilePath(filePath);
            });

          files.forEach(async (filePath) => {
            // should process only .csv files
            if (path.extname(filePath) !== '.csv') {
              return;
            }

            const stat = await statAsync(this.getFullFilePath(filePath));
            const oldFileState = this.folderState[filePath];
            const newFileState = {
              path: filePath,
              modified: stat.mtime,
            }

            if (!oldFileState || !_.isEqual(oldFileState, newFileState)) {
              this.folderState[filePath] = newFileState;
              this.modifiedFiles.push(this.getFullFilePath(filePath));
            }
          });
        })
        .catch((error) => {
          throw new Error(`Error occurs while reading folder(${this.folderPath}): ${error}`);
        })

      if (this.modifiedFiles.length || this.removedFiles.length) {
        this.emit('dirwatcher:changed',
          {
            modified: this.modifiedFiles,
            removed: this.removedFiles,
          },
        );
        this.modifiedFiles = this.removedFiles = [];
      }
    }

    setInterval(readFolder, this.delay);
  }

  getFullFilePath(filePath) {
    return path.join(this.folderPath, filePath);
  }
}
