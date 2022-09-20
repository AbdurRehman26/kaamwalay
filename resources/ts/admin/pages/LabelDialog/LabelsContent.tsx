import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import LabelLogo from '@shared/assets/label.png';
import { CardLabelEntity } from '@shared/entities/CardLabelEntity';

const CardDiv = styled(Grid)({
    display: 'flex',
    justifyContent: 'space-between',

    '.CardInfo': {
        display: 'flex',
        alignItems: 'center',
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
        margin: '10px 0px',
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
        marginRight: '10px',
    },
    '.CheckBoxLabel': {
        '& .MuiFormControlLabel-label': {
            fontSize: '14px!important',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: '#20BFB8',
        },
    },
    '.LabelImageLeftText': {
        position: 'absolute',
        marginTop: '115px',
        marginLeft: '26px',
    },
    '.LabelImageRightText': {
        position: 'absolute',
        right: '38px',
        marginTop: '115px',
        textAlign: 'end',
    },
    '.LabelText': {
        fontSize: '10px',
        fontWeight: 'bold',
    },
    '.GradeText': {
        fontSize: '20px',
        fontWeight: 'bold',
    },
});

interface props {
    labels: CardLabelEntity;
}

export function LabelsContent({ labels }: props) {
    const [lineOne, setLineOne] = useState(labels.lineOne);
    const [lineTwo, setLineTwo] = useState(labels.lineTwo);
    const [lineThree, setLineThree] = useState(labels.lineThree);
    const [lineFour, setLineFour] = useState(labels.lineFour);

    function updateLabels() {
        const cardsLabel = [];
        cardsLabel.push({ cardLabelId: '1', lineOne, lineTwo, lineThree, lineFour });
        console.log(cardsLabel);
        // dispatch(updateCardsLabel(cardsLabel));
    }

    return (
        <CardDiv>
            <div className={'LeftSideDiv'}>
                <div className={'CardInfo'}>
                    <div className={'CardImageDiv'}>
                        <img
                            src={labels.cardProduct?.imagePath}
                            alt={labels.cardProduct?.name}
                            className={'CardImage'}
                        />
                    </div>
                    <div className={'CardTextDiv'}>
                        <Typography className={'CardName'}>{labels.cardProduct?.name}</Typography>
                        <Typography className={'CardLongName'}>{labels.cardProduct?.longName}</Typography>
                    </div>
                </div>
                <div>
                    <Typography className={'LinesText'}>Lines 1 - 4</Typography>
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
                    className={'CheckBoxLabel'}
                    control={<Checkbox />}
                    label="Save changes to this card’s label"
                />
            </div>
            <div className={'RightSideDiv'}>
                <Typography className={'LabelPreviewText'}>Label Preview</Typography>
                <div className={'LabelImageLeftText'}>
                    <Typography className={'LabelText'}>{labels?.lineOne}</Typography>
                    <Typography className={'LabelText'}>{labels?.lineTwo}</Typography>
                    <Typography className={'LabelText'}>{labels?.lineThree}</Typography>
                    <Typography className={'LabelText'}>{labels?.lineFour}</Typography>
                </div>
                <div className={'LabelImageRightText'}>
                    <Typography className={'LabelText'}>{labels?.nickName}</Typography>
                    <Typography className={'GradeText'}>{labels?.grade}</Typography>
                    <Typography className={'LabelText'}>{labels?.certificateNumber}</Typography>
                </div>
                <img src={LabelLogo} alt={'Label'} className={'LableImage'} />
            </div>
            <button onClick={updateLabels}></button>
        </CardDiv>
    );
}
