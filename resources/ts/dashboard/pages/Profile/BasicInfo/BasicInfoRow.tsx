import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import RobogradingAvatar from '@shared/assets/dummyAvatar.svg';
import { useAuth } from '@shared/hooks/useAuth';

interface BasicInfoRowProps {
    label: string;
    value: string;
    shown?: boolean;
    onSave?: any;
    onEdit?: any;
    onCancel?: any;
    isSaveBtnDisabled?: boolean;
    children?: any;
    hideDivider?: boolean;
    showProfilePic?: boolean;
    onProfilePicPress?: any;
}

const useStyle = makeStyles(
    () => {
        return {
            textLabel: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                color: 'rgba(0, 0, 0, 0.54)',
            },
            valueLabel: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.87)',
            },
            buttonsContainer: {
                width: '38%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'right',
                marginTop: '25x',
                marginBottom: '32px',
            },
            saveBtn: {
                color: '#fff',
                width: '140px',
                height: '48px',
            },
            cancelBtn: {
                marginRight: '12px',
                color: '#20BFB8',
            },
            editContainer: {
                padding: 16,
                backgroundColor: '#F9F9F9',
                width: '100%',
                borderBottomStyle: 'solid',
                borderBottomColor: '#E0E0E0',
                borderBottomWidth: '2px',
                borderTopStyle: 'solid',
                borderTopColor: '#E0E0E0',
                borderTopWidth: '1px',
                marginBottom: '24px',
            },
        };
    },
    { name: 'BasicInfoRow' },
);

export function BasicInfoRow(props: BasicInfoRowProps) {
    const classes = useStyle();
    const {
        label,
        value,
        shown,
        children,
        onEdit,
        hideDivider,
        onSave,
        showProfilePic,
        isSaveBtnDisabled,
        onProfilePicPress,
    } = props;
    const user$ = useAuth().user;

    return (
        <>
            {!shown ? (
                <>
                    <Grid
                        container
                        paddingLeft={'16px'}
                        paddingRight={'16px'}
                        marginBottom={'23px'}
                        alignItems={'center'}
                    >
                        <Grid container item xs={3} justifyContent={'flex-start'}>
                            <Typography variant={'subtitle1'} className={classes.textLabel}>
                                {label}
                            </Typography>
                        </Grid>
                        <Grid container item xs={5} justifyContent={'flex-start'}>
                            <Box width={'100%'} sx={{ overflowWrap: 'break-word' }}>
                                <Typography variant={'subtitle1'} className={classes.valueLabel}>
                                    {value}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid container item xs={4} justifyContent={'flex-end'}>
                            {children ? (
                                <Button variant={'text'} size={'medium'} onClick={onEdit}>
                                    Edit
                                </Button>
                            ) : null}
                            {showProfilePic ? (
                                <Box paddingRight={'12px'}>
                                    <ButtonBase onClick={onProfilePicPress}>
                                        <Avatar src={user$?.profileImage || RobogradingAvatar} />
                                    </ButtonBase>
                                </Box>
                            ) : null}
                        </Grid>
                        {!hideDivider ? <Divider sx={{ width: '100%', marginTop: '16px' }} /> : null}
                    </Grid>
                </>
            ) : (
                <div className={classes.editContainer}>
                    {children}
                    <div className={classes.buttonsContainer}>
                        <Button variant={'text'} color={'secondary'} className={classes.cancelBtn} onClick={onEdit}>
                            Cancel
                        </Button>
                        <Button
                            variant={'contained'}
                            disabled={isSaveBtnDisabled}
                            color={'primary'}
                            className={classes.saveBtn}
                            onClick={onSave}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
