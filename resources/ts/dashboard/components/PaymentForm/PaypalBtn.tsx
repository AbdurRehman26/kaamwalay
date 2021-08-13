// noinspection BadExpressionStatementJS
import React, { useEffect, useRef } from 'react';

function PaypalBtn() {
    const paypal = useRef();

    useEffect(() => {
        // @ts-ignore
        window.paypal
            .Buttons({
                createOrder: function (data: any, actions: any) {
                    return fetch('http://localhost:1337/create-paypal-transaction', {
                        method: 'post',
                    })
                        .then(function (res) {
                            return res.json();
                        })
                        .then(function (orderData) {
                            return orderData.id;
                        });
                },
            })
            .render(paypal.current);
    }, []);

    return (
        <div>
            <div ref={paypal as any}></div>
        </div>
    );
}

export default PaypalBtn;
