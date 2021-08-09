import { NotificationType } from '@shared/constants/NotificationType';
import { sha256 } from '@shared/lib/hash';

export class NotificationItem {
    public wait!: boolean;

    constructor(
        public type: NotificationType,
        public message: string,
        public title: string = '',
        public key: string = '',
    ) {}

    checksum() {
        if (!this.key) {
            this.key = sha256(`${this.type}:${this.title}-${this.message}`);
        }
        return this;
    }

    withWait() {
        this.wait = true;
        return this;
    }
}
