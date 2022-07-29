export enum SubmissionSteps {
    Placed = 'Placed',
    Confirmed = 'Confirmed',
    Graded = 'Graded',
    Assembled = 'Assembled',
    Shipped = 'Shipped',
}

export const SubmissionDetails: Record<SubmissionSteps, string[]> = {
    Placed: [
        'Your submission has been placed. The next step is to ship the cards to us.',
        'Once we receive the shipment arrives we will begin grading your cards.',
    ],
    Confirmed: [
        'We have reviewed your cards and will start grading them soon.',
        'You will receive an email as soon as grading is complete.',
    ],
    Graded: [
        'Your cards have been graded! You can see all grades in "Your Cards" tab.',
        'We are now preparing your cards for return shipment.',
    ],
    Assembled: [
        'Your graded cards have been slabbed and packed for shipment! We will notify you via email as soon as your cards are graded so you can preview your grades.',
    ],
    Shipped: ['We have sent out the return shipment. You can track your shipment here:'],
};
