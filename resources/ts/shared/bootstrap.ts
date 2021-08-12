import { resolveInjectable } from './lib/dependencyInjection/resolveInjectable';
import { APIService } from './services/APIService';

resolveInjectable(APIService).attach();
