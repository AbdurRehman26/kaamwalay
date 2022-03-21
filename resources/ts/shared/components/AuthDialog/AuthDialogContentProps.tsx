import { AuthenticatedUserEntity } from '../../entities/AuthenticatedUserEntity';
import { AuthDialogView } from './AuthDialogView';

export interface AuthDialogContentProps {
    onViewChange: (view: AuthDialogView) => void;
    onAuthSuccess(authenticatedUser: AuthenticatedUserEntity): void;
}
