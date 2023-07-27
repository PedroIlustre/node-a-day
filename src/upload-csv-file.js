import fs from 'fs'
import csv from 'csv-parser'
import { Writable, Transform } from 'node:stream'

export class UploadCsvFile {

  upload(req) {
    let data = [];

    req.on('data', (chunk) => {
      data.push(chunk);
    });

    const fileData = Buffer.concat(data);

    console.log(fileData)
    return 0
    const readableStream = fs.createReadStream('file.csv')
    const transformStreamToObject = csv({separator:';'})
    const transformStreamToString = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        callback(null,JSON.stringify(chunk))
      },
    })
    const writableStream = new Writable({write(chunk, encoding, callback) {
      const string = chunk.toString()
      const data = JSON.parte(string)
      console.info(data)
      callback()
    }})
    
    readableStream
    .pipe(transformStreamToObject)
    .pipe(transformStreamToString)
    .pipe(writableStream)
    .on('close', () => console.log('Finalizou', Date()))
  }

}