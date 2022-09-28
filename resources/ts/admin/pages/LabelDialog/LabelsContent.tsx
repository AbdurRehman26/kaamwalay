import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LabelLogo from '@shared/assets/label.png';
import { CardLabelEntity } from '@shared/entities/CardLabelEntity';
import { updateMultipleCardsLabel } from '@shared/redux/slices/adminOrderLabelsSlice';

const CardDiv = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',

    '.CardInfo': {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },

    '.CardName': {
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CardImage': {
        width: '35px',
        height: '48px',
    },

    '.CardLongName': {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CardTextDiv': {
        paddingLeft: '7px',
    },
    '.LinesText': {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '.InputTextDiv': {
        display: 'flex',
        alignItems: 'center',
    },
    '.RightSideDiv': {
        width: '337px',
        background: '#5F5F5F',
    },
    '.LabelPreviewText': {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: '#FFFFFF',
        padding: '20px',
    },
    '.LeftSideDiv': {
        width: '337px',
        padding: '15px',
    },
    '.LableImage': {
        width: '297px',
        margin: '15px',
        height: '178px',
    },
    '.TextBoxNumber': {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
        marginRight: '5px',
    },
    '.CheckBoxLabel': {
        '& .MuiFormControlLabel-label': {
            fontSize: '14px!important',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: '#20BFB8',
        },
    },
    '.Imagecontent': {
        display: 'flex',
        position: 'relative',
        justifyContent: 'space-between',
        bottom: '95px',
        alignItems: 'center',
        padding: '0px 25px',
        width: '325px',
    },
    '.LabelImageLeftText': {
        marginLeft: '5px',
    },
    '.LabelImageRightText': {
        marginRight: '10px',
    },
    '.LabelText': {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '14px',
    },
    '.GradeText': {
        fontSize: '28px',
        lineHeight: '28px',
        fontWeight: 400,
    },
});
const useStyles = makeStyles(() => ({
    CheckboxLabel: {
        '& .MuiFormControlLabel-label': {
            fontSize: '14px!important',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: ({ checked }: any) => (checked === true ? '#20BFB8' : 'rgba(0, 0, 0, 0.87)'),
            fontWeight: ({ checked }: any) => (checked === true ? 500 : 400),
        },
    },
}));

interface props {
    labels: CardLabelEntity;
}

export function LabelsContent({ labels }: props) {
    const [lineOne, setLineOne] = useState(labels?.lineOne);
    const [lineTwo, setLineTwo] = useState(labels?.lineTwo);
    const [lineThree, setLineThree] = useState(labels?.lineThree);
    const [lineFour, setLineFour] = useState(labels?.lineFour);
    const [checked, setChecked] = useState(true);
    const [cardLabelId, setCardLabelId] = useState(labels?.cardLabelId);
    const [certificateNumber, setCertificateNumber] = useState(labels?.certificateNumber);
    const [persistChanges, setPersistChanges] = useState(labels?.persistChanges);
    const dispatch = useDispatch();
    const classes = useStyles({ checked: persistChanges });

    useEffect(() => {
        setCardLabelId(labels?.cardLabelId);
        setCertificateNumber(labels?.certificateNumber);
        setLineOne(labels?.lineOne);
        setLineTwo(labels?.lineTwo);
        setLineThree(labels?.lineThree);
        setLineFour(labels?.lineFour);
        setPersistChanges(labels?.persistChanges);
    }, [labels]);

    useEffect(() => {
        if (checked) {
            dispatch(
                updateMultipleCardsLabel({
                    cardLabelId,
                    certificateNumber,
                    lineOne,
                    lineTwo,
                    lineThree,
                    lineFour,
                    persistChanges,
                }),
            );
        }
        if (!checked) {
            dispatch(
                updateMultipleCardsLabel({
                    cardLabelId,
                    certificateNumber,
                    lineOne,
                    lineTwo,
                    lineThree,
                    lineFour,
                    persistChanges,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked, dispatch, lineOne, lineTwo, lineThree, lineFour, persistChanges]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPersistChanges(event.target.checked);
        setChecked(event.target.checked);
    };

    return (
        <CardDiv>
            <div className={'LeftSideDiv'}>
                <div className={'CardInfo'}>
                    <div className={'CardImageDiv'}>
                        <img
                            src={labels?.cardProduct?.imagePath}
                            alt={labels?.cardProduct?.name}
                            className={'CardImage'}
                        />
                    </div>
                    <div className={'CardTextDiv'}>
                        <Typography className={'CardName'}>{labels?.cardProduct?.name}</Typography>
                        <Typography className={'CardLongName'}>{labels?.cardProduct?.longName}</Typography>
                    </div>
                </div>
                <div className={'InputTextDiv'}>
                    <Typography className={'TextBoxNumber'}>1:</Typography>
                    <TextField
                        sx={{
                            borderRadius: '4px',
                            padding: '5px',
                            width: '100%',
                        }}
                        name={'lineOne'}
                        value={lineOne}
                        fullWidth
                        size={'small'}
                        variant={'outlined'}
                        onChange={(e) => {
                            setLineOne(e.target.value);
                        }}
                    />
                </div>
                <div className={'InputTextDiv'}>
                    <Typography className={'TextBoxNumber'}>2:</Typography>
                    <TextField
                        sx={{
                            borderRadius: '4px',
                            padding: '5px',
                            width: '100%',
                        }}
                        name={'lineTwo'}
                        value={lineTwo}
                        fullWidth
                        size={'small'}
                        variant={'outlined'}
                        onChange={(e) => {
                            setLineTwo(e.target.value);
                        }}
                    />
                </div>
                <div className={'InputTextDiv'}>
                    <Typography className={'TextBoxNumber'}>3:</Typography>
                    <TextField
                        sx={{
                            borderRadius: '4px',
                            padding: '5px',
                            width: '100%',
                        }}
                        name={'lineThree'}
                        value={lineThree}
                        fullWidth
                        size={'small'}
                        variant={'outlined'}
                        onChange={(e) => {
                            setLineThree(e.target.value);
                        }}
                    />
                </div>
                <div className={'InputTextDiv'}>
                    <Typography className={'TextBoxNumber'}>4:</Typography>
                    <TextField
                        sx={{
                            borderRadius: '4px',
                            padding: '5px',
                            width: '100%',
                        }}
                        name={'lineFour'}
                        value={lineFour}
                        fullWidth
                        size={'small'}
                        variant={'outlined'}
                        onChange={(e) => {
                            setLineFour(e.target.value);
                        }}
                    />
                </div>
                <FormControlLabel
                    className={classes.CheckboxLabel}
                    control={<Checkbox onChange={handleChange} checked={persistChanges} />}
                    label="Save changes to this card’s label"
                />
            </div>
            <div className={'RightSideDiv'}>
                <Typography className={'LabelPreviewText'}>Label Preview</Typography>
                <div>
                    <img src={LabelLogo} alt={'Label'} className={'LableImage'} />
                </div>
                <div className={'Imagecontent'}>
                    <div className={'LabelImageLeftText'}>
                        <Typography className={'LabelText'}>{lineOne?.substring(0, 26)}</Typography>
                        <Typography className={'LabelText'}>{lineTwo?.substring(0, 26)}</Typography>
                        <Typography className={'LabelText'}>{lineThree?.substring(0, 26)}</Typography>
                        <Typography className={'LabelText'}>{lineFour?.substring(0, 26)}</Typography>
                    </div>
                    <div className={'LabelImageRightText'}>
                        <Typography className={'LabelText'} sx={{ textAlign: 'end' }}>
                            {labels?.nickName}
                        </Typography>
                        <Typography className={'GradeText'} sx={{ textAlign: 'end' }}>
                            {labels?.grade}
                        </Typography>
                        <Typography className={'LabelText'} sx={{ textAlign: 'end' }}>
                            {labels?.certificateNumber}
                        </Typography>
                    </div>
                </div>
            </div>
        </CardDiv>
    );
}
