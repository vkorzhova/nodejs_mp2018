import config from './config';
import { Product, User } from './models';

console.log(`The name of application: ${config.name}`);

new Product();
new User();
