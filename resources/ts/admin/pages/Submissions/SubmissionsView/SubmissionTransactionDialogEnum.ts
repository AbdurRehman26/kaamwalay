export enum DialogStateEnum {
    ShowAddExtraCharge = 'show-add-extra-charge',
    ShowIssueRefund = 'show-issue-refund',
}
export const DialogStateMap = {
    [DialogStateEnum.ShowAddExtraCharge]: {
        title: 'Add Extra Charge',
        amountLabel: 'Charge Amount',
    },
    [DialogStateEnum.ShowIssueRefund]: {
        title: 'Issue Refund',
        amountLabel: 'Refund Amount',
    },
};
