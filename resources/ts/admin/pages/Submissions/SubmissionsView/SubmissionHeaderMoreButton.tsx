import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import * as React from 'react';
import { useCallback } from 'react';

const useStyles = makeStyles(
    (theme) => ({
        menuButton: {
            marginLeft: theme.spacing(2),
        },
    }),
    { name: 'SubmissionHeaderMoreButton' },
);

enum Options {
    AddExtraCharge,
    IssueRefund,
}

interface SubmissionHeaderMoreButtonProps {
    // TODO: Figure TS Type for functions passed as props
    setShowPaymentActionsModal?: any;
}

export default function SubmissionHeaderMoreButton(props: SubmissionHeaderMoreButtonProps) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleClose();

            switch (option) {
                case Options.AddExtraCharge:
                    props.setShowPaymentActionsModal('show-add-extra-charge');
                    break;
                case Options.IssueRefund:
                    props.setShowPaymentActionsModal('show-issue-refund');
                    break;
            }
        },
        [handleClose],
    );

    return (
        <div>
            <IconButton size={'medium'} onClick={handleClick} className={classes.menuButton}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleOption(Options.AddExtraCharge)}>Add Extra Charge</MenuItem>
                <MenuItem onClick={handleOption(Options.IssueRefund)}>Issue Refund</MenuItem>
            </Menu>
        </div>
    );
}
