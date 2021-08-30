export enum EventCategories {
    Submissions = 'Submissions',
    ServiceLevels = 'Service Levels',
    Cards = 'Cards Selection',
    ShippingAddresses = 'Shipping Address',
    PaymentMethods = 'Payment Methods',
    Auth = 'Authentication',
}

export enum ServiceLevelEvents {
    pressed = 'Pressed on service level',
}

export enum CardsSelectionEvents {
    added = 'Card added',
    removed = 'Card removed',
}

export enum PaymentMethodEvents {
    addedNewStripeCard = 'Added a new stripe card',
    continuedWithStripePayment = 'Continued using stripe payment method',
    continuedWithPaypalPayment = 'Continued using paypal payment method',
}

export enum ShippingAddressEvents {
    continuedWithExisting = 'Submitted an already existing address',
    continuedWithNewAddress = 'Submitted a new address',
}

export enum SubmissionEvents {
    initiated = 'New Submission Initiated',
    paid = 'Submission Paid',
}

export enum AuthenticationEvents {
    loggedIn = 'Logged in successfully',
    failedLogIn = 'Failed to log in',
    loggedOut = 'Logged out',
    registerSuccess = 'Registered & logged in successfully',
    sentResetLink = 'Sent Password Reset link successfully',
}
