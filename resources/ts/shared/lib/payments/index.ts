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
import _switch from '../../assets/icons/payments/switch.svg';
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
const _getter = (icon: string, prop: 'icon' | 'title'): string | null => {
    icon = icon?.toLowerCase() ?? DEFAULT_ICON;
    return icon && ICONS.hasOwnProperty(icon) ? ICONS[icon][prop] : DEFAULT_ICON;
};

/**
 * Image getter
 * @param icon
 * @returns {string}
 */
export const getPaymentIcon = (icon: string): string | null => _getter(icon, 'icon');

/**
 * Title getter
 * @param icon
 * @returns {string}
 */
export const getPaymentTitle = (icon: string): string | null => _getter(icon, 'title');

/**
 * Icon register
 * @param icon
 * @param title
 * @param aliases
 * @private
 */
const _register = (icon: string, title: string, ...aliases: string[]): void => {
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

_register(amex, 'American Express', 'amex', 'american express');
_register(twoCo, '2 Checkout', '2co', '2 checkout', 'two co');
_register(amazon, 'Amazon', 'amazon');
_register(bbu, 'Better Business Bureau', 'better business bureau', 'bbu');
_register(bluePay, 'Blue Pay', 'blue pay');
_register(cirrus, 'Cirrus', 'cirrus');
_register(citi, 'Citi bank', 'citi', 'citi bank');
_register(clickbank, 'Click Bank', 'click bank');
_register(dinnersClub, 'Dinners Club', 'dinners club');
_register(directDebit, 'Direct Debit', 'direct debit');
_register(discover, 'Discover', 'discover');
_register(ebay, 'Ebay', 'ebay');
_register(eway, 'Eway', 'eway');
_register(hsbc, 'HSBC', 'hsbc');
_register(ideal, 'Ideal', 'ideal');
_register(jcb, 'JCB', 'jcb');
_register(maestro, 'Maestro', 'maestro');
_register(mastercard, 'Master Card', 'master card');
_register(paypal, 'Paypal', 'pay pal');
_register(paypoint, 'Paypoint', 'paypoint');
_register(pickNPay, 'Pick n Pay', 'pick n pay');
_register(postepay, 'Poste Pay', 'poste pay');
_register(sage, 'Sage', 'sage');
_register(solo, 'Solo', 'solo');
_register(_switch, 'Switch', 'switch');
_register(symbols, 'Symbols', 'symbols');
_register(unionPay, 'Union Pay', 'union pay');
_register(visa, 'Visa', 'visa');
_register(wepay, 'We Pay', 'we pay');
_register(westernUnion, 'Western Union', 'western union');
_register(wirecard, 'Wire Card', 'wire card');
_register(worldpay, 'World Pay', 'world pay');

export default ICONS;
