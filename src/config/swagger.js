import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'swagger.yaml'), 'utf8'));

export default swaggerDocument;
