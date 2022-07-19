import { HttpException, Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
// import path
import * as path from 'path';

@Injectable()
export class AppService {
  private readonly dirPath: string;
  constructor() {
    this.dirPath = path.join(__dirname, '../src/python/test.py');
  }

  async getPyhton(query: any): Promise<any> {
    try {
      console.log(query);
      const process = spawn('python3', [this.dirPath, query.value]);

      const test = new Promise((resolve, _) => {
        process.stdout.on('data', async (data) => {
          console.log('Pipe data from python script ...');

          resolve(data.toString());
        });
      });
      return test.then((value) => {
        console.log('resolved : \n', value);
        return value;
      });
    } catch (e) {
      console.error(e);
      throw new HttpException('Error', 500);
    }
  }
}
