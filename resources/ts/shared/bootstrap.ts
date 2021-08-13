import { app } from './lib/app';
import { APIService } from './services/APIService';

app(APIService).attach();
