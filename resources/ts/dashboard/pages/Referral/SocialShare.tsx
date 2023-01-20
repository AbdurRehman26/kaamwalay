import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';

interface props {
    name: string;
}

const SocialShareDiv = styled(Grid)({
    '.SocialButton': {
        background: '#F5F5F5!important',
        border: '1px solid #E0E0E0!important',
        borderRadius: '4px!important',
        fontSize: '14px!important',
        lineHeight: '20px!important',
        textAlign: 'center!important',
        letterSpacing: '0.35px!important',
        color: '#20BFB8!important',
        padding: '15px 20px!important',
        textTransform: 'uppercase',
        marginTop: '20px',
    },
    '.SocialHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '10px 0px',
    },
});

export function SocialShare({ name }: props) {
    const [socialMessage, setSocialMessage] = useState('');

    useEffect(() => {
        setSocialMessage(
            'I’ve been using AGS Grading to grade my cards. They use artificial intelligence to give you the most accurate grades possible. Sign up using this link www.robograding.com/referral/T902039 to get $15 OFF your first submission. ',
        );
    }, []);

    return (
        <SocialShareDiv>
            <Typography className={'SocialHeading'}>Share on {name}</Typography>
            <TextField
                value={socialMessage}
                fullWidth
                multiline
                variant={'outlined'}
                onChange={(e: any) => setSocialMessage(e.target.value)}
            />
            {name === 'Facebook' ? (
                <FacebookShareButton
                    url={'https://www.robograding.com'}
                    title={socialMessage}
                    className={'SocialButton'}
                >
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </FacebookShareButton>
            ) : name === 'Twitter' ? (
                <TwitterShareButton
                    url={'https://www.robograding.com'}
                    title={socialMessage}
                    className={'SocialButton'}
                >
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </TwitterShareButton>
            ) : name === 'Linkedin' ? (
                <LinkedinShareButton
                    url={'https://www.robograding.com'}
                    title={socialMessage}
                    className={'SocialButton'}
                >
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </LinkedinShareButton>
            ) : name === 'Whatsapp' ? (
                <WhatsappShareButton
                    url={'https://www.robograding.com'}
                    title={socialMessage}
                    className={'SocialButton'}
                >
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </WhatsappShareButton>
            ) : null}
        </SocialShareDiv>
    );
}

export default SocialShare;
