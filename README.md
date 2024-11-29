# JSON Schema Validator CLI
A command line JSON Schema validator based on the famous [AJV Library](https://github.com/ajv-validator/ajv)

## Usage
```
json-schema-validator-cli.exe <schema.json> <instance.json> [results.log]
```
results: 
- `ok` if no errors
- error description in case of errors

## Build
Build and executable file
```
npm run build
```