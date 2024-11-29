import { argv } from 'node:process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Ajv2019 } from 'ajv/dist/2019.js';
import { Ajv2020 } from 'ajv/dist/2020.js';
const require = createRequire(import.meta.url);
try {
  const args = argv.slice(2);
  if (args.length < 2) throw new Error('Usage: json-schema-validator-cli <schema.json> <instance.json> [output.log]');
  if (!existsSync(args[0])) throw new Error('Invalid schema path parameter: ' + args[0]);
  if (!existsSync(args[1])) throw new Error('Invalid instance path parameter: ' + args[1]);
  const schema = JSON.parse(readFileSync(args[0], { encoding: 'utf8' }));
  const instance = JSON.parse(readFileSync(args[1], { encoding: 'utf8' }));
  const output = results => args[2] ? writeFileSync(args[2], results, { encoding: 'utf8' }) : console.log(results);
  const getAjv = schema => schema === 'https://json-schema.org/draft/2020-12/schema' ? { Ajv: Ajv2020 } : schema === 'https://json-schema.org/draft/2019-09/schema' ? { Ajv: Ajv2019 } : schema === 'https://json-schema.org/draft-06/schema' ? { Ajv: Ajv2019, metaschema: 'ajv/dist/refs/json-schema-draft-06.json' } : { Ajv: Ajv2019, metaschema: 'ajv/dist/refs/json-schema-draft-07.json' };
  const { Ajv, metaschema } = getAjv(schema.$schema);
  const ajv = new Ajv({
    allErrors: true,
    strict: false
  });
  if (metaschema) {
    ajv.addMetaSchema(require(metaschema));
  }
  const validate = ajv.compile(schema);
  output(validate(instance) ? 'ok' : (validate.errors ?? []).map(error => error.instancePath + ' : ' + error.message).join('\n'));
} catch (e) {
  console.log(e.message);
}
