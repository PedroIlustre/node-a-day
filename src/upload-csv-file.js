import fs from 'fs'
import csv from 'csv-parser'
import { Writable, Transform } from 'node:stream'

export class UploadCsvFile {

  upload() {
    const readableStream = fs.createReadStream('task_import.csv')
    const transformStreamToObject = csv({separator:';'})
    const transformStreamToString = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        callback(null,JSON.stringify(chunk))
      },
    })
    const writableStream = new Writable({write(chunk, encoding, callback) {
      const string = chunk.toString()
      const data = JSON.parse(string)
      callback()
    }})

    const dataArray = []; // Array to store data emitted by the writableStream

    // Event listener to capture the data emitted by the writableStream
    writableStream.on('data', (data) => {
      dataArray.push(data);
    });
    
    writableStream.on('finish', () => {
      console.log(dataArray); 
      console.log('Writable Stream Finished');
      // You can access the dataArray here after the writableStream is finished
    });

    return readableStream
    .pipe(transformStreamToObject)
    .pipe(transformStreamToString)
    .pipe(writableStream)
  }

}