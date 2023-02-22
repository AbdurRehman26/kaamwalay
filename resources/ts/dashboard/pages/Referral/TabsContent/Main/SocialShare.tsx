import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { useConfiguration } from '@shared/hooks/useConfiguration';

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

interface props {
    name: string;
    referralUrl: string;
}

export function SocialShare({ name, referralUrl }: props) {
    const { featureReferralDiscountPercentage } = useConfiguration();
    const socialMessage = `I’ve been using AGS Grading to grade my cards. They use artificial intelligence to give you the most accurate grades possible. Sign up using this link to get ${featureReferralDiscountPercentage}% OFF your first submission.`;

    return (
        <SocialShareDiv>
            <Typography className={'SocialHeading'}>Share on {name}</Typography>
            <TextField value={socialMessage} fullWidth multiline variant={'outlined'} />
            {name === 'Facebook' ? (
                <FacebookShareButton url={referralUrl} title={socialMessage} className={'SocialButton'}>
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </FacebookShareButton>
            ) : name === 'Twitter' ? (
                <TwitterShareButton url={referralUrl} title={socialMessage} className={'SocialButton'}>
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </TwitterShareButton>
            ) : name === 'Linkedin' ? (
                <LinkedinShareButton url={referralUrl} title={socialMessage} className={'SocialButton'}>
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </LinkedinShareButton>
            ) : name === 'Whatsapp' ? (
                <WhatsappShareButton url={referralUrl} title={socialMessage} className={'SocialButton'}>
                    <Typography sx={{ fontWeight: 500 }}>SHARE ON {name}</Typography>
                </WhatsappShareButton>
            ) : null}
        </SocialShareDiv>
    );
}

export default SocialShare;
