import { uniq } from 'lodash';
import twoCo from '../../assets/icons/payments/2co.svg';
import amazon from '../../assets/icons/payments/amazon.svg';
import amex from '../../assets/icons/payments/american-express.svg';
import bbu from '../../assets/icons/payments/better-business-bureau.svg';
import bluePay from '../../assets/icons/payments/bluepay.svg';
import cirrus from '../../assets/icons/payments/cirrus.svg';
import citi from '../../assets/icons/payments/citi.svg';
import clickbank from '../../assets/icons/payments/clickbank.svg';
import dinnersClub from '../../assets/icons/payments/dinners-club.svg';
import directDebit from '../../assets/icons/payments/direct-debit.svg';
import discover from '../../assets/icons/payments/discover.svg';
import ebay from '../../assets/icons/payments/ebay.svg';
import eway from '../../assets/icons/payments/eway.svg';
import hsbc from '../../assets/icons/payments/hsbc.svg';
import ideal from '../../assets/icons/payments/ideal.svg';
import jcb from '../../assets/icons/payments/jcb.svg';
import maestro from '../../assets/icons/payments/maestro.svg';
import mastercard from '../../assets/icons/payments/mastercard.svg';
import paypal from '../../assets/icons/payments/paypal.svg';
import paypoint from '../../assets/icons/payments/paypoint.svg';
import pickNPay from '../../assets/icons/payments/pick-n-pay.svg';
import postepay from '../../assets/icons/payments/postepay.svg';
import sage from '../../assets/icons/payments/sage.svg';
import solo from '../../assets/icons/payments/solo.svg';
import switchIcon from '../../assets/icons/payments/switch.svg';
import symbols from '../../assets/icons/payments/symbols.svg';
import unionPay from '../../assets/icons/payments/union-pay.svg';
import visa from '../../assets/icons/payments/visa.svg';
import wepay from '../../assets/icons/payments/wepay.svg';
import westernUnion from '../../assets/icons/payments/western-union.svg';
import wirecard from '../../assets/icons/payments/wirecard.svg';
import worldpay from '../../assets/icons/payments/worldpay.svg';

export const ICONS: Record<string, { title: string; icon: string }> = {};

const DEFAULT_ICON = null;

/**
 * Icon getter
 * @param icon
 * @param prop
 * @returns {null}
 * @private
 */
const getter = (icon: string, prop: 'icon' | 'title'): string | null => {
    icon = icon?.toLowerCase() ?? DEFAULT_ICON;
    return icon && ICONS.hasOwnProperty(icon) ? ICONS[icon][prop] : DEFAULT_ICON;
};

/**
 * Image getter
 * @param icon
 * @returns {string}
 */
export const getPaymentIcon = (icon: string): string | null => getter(icon, 'icon');

/**
 * Title getter
 * @param icon
 * @returns {string}
 */
export const getPaymentTitle = (icon: string): string | null => getter(icon, 'title');

/**
 * Icon register
 * @param icon
 * @param title
 * @param aliases
 * @private
 */
const registerIcon = (icon: string, title: string, ...aliases: string[]): void => {
    aliases.forEach((alias) => {
        alias = alias.toLowerCase();

        uniq([alias.replace(/\s/, '_'), alias.replace(/\s/, '-'), alias.replace(/\s/, ''), alias]).forEach(
            (version) => {
                ICONS[version] = {
                    icon,
                    title,
                };
            },
        );
    });
};

registerIcon(amex, 'American Express', 'amex', 'american express');
registerIcon(twoCo, '2 Checkout', '2co', '2 checkout', 'two co');
registerIcon(amazon, 'Amazon', 'amazon');
registerIcon(bbu, 'Better Business Bureau', 'better business bureau', 'bbu');
registerIcon(bluePay, 'Blue Pay', 'blue pay');
registerIcon(cirrus, 'Cirrus', 'cirrus');
registerIcon(citi, 'Citi bank', 'citi', 'citi bank');
registerIcon(clickbank, 'Click Bank', 'click bank');
registerIcon(dinnersClub, 'Dinners Club', 'dinners club');
registerIcon(directDebit, 'Direct Debit', 'direct debit');
registerIcon(discover, 'Discover', 'discover');
registerIcon(ebay, 'Ebay', 'ebay');
registerIcon(eway, 'Eway', 'eway');
registerIcon(hsbc, 'HSBC', 'hsbc');
registerIcon(ideal, 'Ideal', 'ideal');
registerIcon(jcb, 'JCB', 'jcb');
registerIcon(maestro, 'Maestro', 'maestro');
registerIcon(mastercard, 'Master Card', 'master card');
registerIcon(paypal, 'Paypal', 'pay pal');
registerIcon(paypoint, 'Paypoint', 'paypoint');
registerIcon(pickNPay, 'Pick n Pay', 'pick n pay');
registerIcon(postepay, 'Poste Pay', 'poste pay');
registerIcon(sage, 'Sage', 'sage');
registerIcon(solo, 'Solo', 'solo');
registerIcon(switchIcon, 'Switch', 'switch');
registerIcon(symbols, 'Symbols', 'symbols');
registerIcon(unionPay, 'Union Pay', 'union pay');
registerIcon(visa, 'Visa', 'visa');
registerIcon(wepay, 'We Pay', 'we pay');
registerIcon(westernUnion, 'Western Union', 'western union');
registerIcon(wirecard, 'Wire Card', 'wire card');
registerIcon(worldpay, 'World Pay', 'world pay');

export default ICONS;
