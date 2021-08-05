export enum SubmissionSteps {
    Placed = 'Placed',
    Arrived = 'Arrived',
    Graded = 'Graded',
    Shipped = 'Shipped',
}

export const SubmissionDetails: Record<SubmissionSteps, string[]> = {
    Placed: [
        'Your submission has been placed. The next step is to ship the cards to us.',
        'Once we receive the shipment arrives we will begin grading your cards.',
    ],
    Arrived: [
        'We have received your cards and will start grading them soon.',
        'You will receive an email as soon as grading is complete.',
    ],
    Graded: [
        'Your cards have been graded! You can see all grades in the "Your Cards" tab.',
        'We are now preparing your cards for return shipment.',
    ],
    Shipped: ['We have sent out the return shipment. You can track your shipment here:'],
};
