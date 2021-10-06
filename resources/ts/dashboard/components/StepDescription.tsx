import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';

type StepDescriptionProps = {
    title: string;
    description: any;
};

const useStyles = makeStyles((theme) => ({
    title: {
        fontFamily: 'Roboto',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '36px',
        letterSpacing: '0px',
        textAlign: 'left',
        marginBottom: '6px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '20px',
        },
    },
    description: {
        fontFamily: 'Roboto',
        color: '#212121',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        textAlign: 'left',
        marginBottom: '32px',
    },
}));

const StepDescription: FunctionComponent<StepDescriptionProps> = ({ title, description }) => {
    const classes = useStyles();

    return (
        <>
            <Typography variant={'h2'} className={classes.title}>
                {title}
            </Typography>
            <Typography variant={'h3'} className={classes.description}>
                {description}
            </Typography>
        </>
    );
};

export default StepDescription;
