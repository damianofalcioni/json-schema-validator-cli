import { argv } from 'node:process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { Ajv } from 'ajv';

try {
  const args = argv.slice(2);
  if (args.length < 2) throw new Error('Usage: json-schema-validator-cli <schema.json> <instance.json> [output.log]');
  if (!existsSync(args[0])) throw new Error('Invalid schema path parameter: ' + args[0]);
  if (!existsSync(args[1])) throw new Error('Invalid instance path parameter: ' + args[1]);
  const schema = JSON.parse(readFileSync(args[0], { encoding: 'utf8' }));
  const instance = JSON.parse(readFileSync(args[1], { encoding: 'utf8' }));
  const output = results => args[2] ? writeFileSync(args[2], results, { encoding: 'utf8' }) : console.log(results);
  const validate = new Ajv({
    allErrors: true,
    strict: false,
    validateSchema: false
  }).compile(schema);
  output(validate(instance) ? 'ok' : (validate.errors ?? []).map(error => error.instancePath + ' : ' + error.message).join('\n'));
} catch (e) {
  console.log(e.message);
}
