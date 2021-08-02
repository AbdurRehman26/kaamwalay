import React, {useEffect} from 'react';
import StepDescription from "./StepDescription";
import {makeStyles} from "@material-ui/core/styles";
import {getServiceLevels, SubmissionService} from "../Redux/Slices/newSubmissionSlice";
import ServiceLevelItem from "./ServiceLevelItem";
import {Container, Divider} from "@material-ui/core";
import {useAppDispatch, useAppSelector} from "../hooks";


const useStyles = makeStyles({
    pageContainer: {
        width: '100%',
        maxWidth: '750px'
    },
    servicesContainer: {
        marginBottom: '64px',
    }
})

export function SubmissionStep01Content() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const serviceLevels = useAppSelector((state) => state.newSubmission.step01Data.availableServiceLevels);
    useEffect(() => {
        dispatch(getServiceLevels());
    }, [dispatch])


    return (
        <Container className={classes.pageContainer}>

                    <StepDescription title='Select your service level'
                                     description="Select your desired service level from the list below"/>
                    <div className={classes.servicesContainer}>
                        {serviceLevels.map((item) => (
                            <ServiceLevelItem key={item.id} {...item} />
                        ))}
                    </div>

                    <Divider light/>

        </Container>

    )
}


export default SubmissionStep01Content;
