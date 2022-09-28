import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LabelLogo from '@shared/assets/label.png';
import { CardLabelEntity } from '@shared/entities/CardLabelEntity';
import { updateMultipleCardsLabel } from '@shared/redux/slices/adminOrderLabelsSlice';
import CardDiv from '@admin/pages/LabelDialog/CardDiv';

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
                        className={'TextField'}
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
                        className={'TextField'}
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
                        className={'TextField'}
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
                        className={'TextField'}
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
