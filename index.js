import fs from 'node:fs';
import { argv } from 'node:process';
import { Ajv } from 'ajv';

try {
  const args = argv.slice(2);
  if (args.length < 2) throw new Error('Usage: json-schema-validator-cli <schema.json> <instance.json> [output.log]');
  if (!fs.existsSync(args[0])) throw new Error('Invalid schema path parameter: ' + args[0]);
  if (!fs.existsSync(args[1])) throw new Error('Invalid instance path parameter: ' + args[1]);

  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: false
  })

  const schema = fs.readFileSync(args[0], { encoding: 'utf8' });
  const instance = fs.readFileSync(args[1], { encoding: 'utf8' });
  const validate = ajv.compile(JSON.parse(schema));
  let results = '';
  if (validate(JSON.parse(instance))) {
    results = 'ok';
  } else {
    for (const error of validate.errors ?? []) {
      results += error.instancePath + ' : ' + error.message + '\n';
    }
  }
  if (args[2]) {
    fs.writeFileSync(args[2], results, { encoding: 'utf8' });
  } else {
    console.log(results);
  }
} catch (e) {
  console.log(e.message);
}
