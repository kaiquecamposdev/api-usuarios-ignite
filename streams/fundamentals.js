import { Readable, Transform, Writable } from 'node:stream';

// 100s -> Inserção no banco de dados
class OneToHundredStream extends Readable {
  index = 1

// 10mb/s -> 10.000
  _read() {
    const i = this.index++

// Readable Streams / Writable Streams
    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        const buf = Buffer.from(String(i))

        this.push(buf)
      }
    }, 1000);
  }
}
class ReverseNumberStream extends Transform {
  _transform(chunk, enconding, callback) {
    const transformed = (Number(chunk.toString())) * -1;
    callback(null, Buffer.from(String(transformed)));
  }
}
class MultiplyByTenStream extends Writable {
  _write(chunk, enconding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

new OneToHundredStream()
  .pipe(new ReverseNumberStream())
  .pipe(new MultiplyByTenStream())