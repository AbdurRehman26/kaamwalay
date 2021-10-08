import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '@shared/lib/utils/cx';
import { font } from '@shared/styles/utils';

type CardPreviewOnlyImageProps = {
    image: string;
    onlyImage: boolean;
};

type CardPreviewProps = {
    id: number;
    image: string;
    name: string;
    description: string;
    certification: string;
    grade?: number;
};

const useStyles = makeStyles(
    (theme) => ({
        root: {
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 5,
            boxShadow: theme.shadows[2],
        },
        gradeScore: {
            position: 'absolute',
            right: 0,
            top: 0,
            padding: '4px 8px',
            borderRadius: '0 0 0 5px',
            backgroundColor: theme.palette.primary.main,
        },
        gradeScoreText: {
            fontWeight: 700,
            color: theme.palette.primary.contrastText,
        },
        imageHolder: {
            position: 'relative',
        },
        image: {
            width: '100%',
            height: 'auto',
            display: 'block',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            left: 0,
            bottom: 0,
            padding: '8px 12px',
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
        headline: {
            marginBottom: 3,
        },
        description: {
            marginBottom: 10,
        },
        smallFont: {
            fontSize: 10,
        },
    }),
    {
        name: 'CardPreview',
    },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: CardPreview
 * @date: 10.08.2021
 * @time: 02:55
 */
export function CardPreview(props: PropsWithChildren<CardPreviewOnlyImageProps | CardPreviewProps>) {
    const { children, onlyImage } = props as PropsWithChildren<CardPreviewOnlyImageProps>;
    const { id, image, grade, certification, name, description } = props as CardPreviewProps;
    const classes = useStyles();
    const isGraded = !!grade && certification;

    const linkProps: Record<string, any> = { className: classes.root };
    const LinkComponent: any = onlyImage ? 'div' : Link;
    if (!onlyImage) {
        linkProps.to = `/cards/${id}/view`;
    }

    return (
        <LinkComponent {...linkProps}>
            <div className={classes.imageHolder}>
                <img src={image} alt={name} className={classes.image} />
            </div>
            {!onlyImage && grade ? (
                <div className={classes.gradeScore}>
                    <Typography color={'textPrimary'} variant={'body1'} className={classes.gradeScoreText}>
                        {grade}
                    </Typography>
                </div>
            ) : null}
            {!onlyImage ? (
                <div className={classes.content}>
                    <Typography
                        color={'textPrimary'}
                        variant={'body2'}
                        className={cx(classes.headline, font.fontWeightMedium)}
                    >
                        {name}
                    </Typography>
                    <Typography
                        color={'textPrimary'}
                        variant={'caption'}
                        className={cx(classes.description, classes.smallFont)}
                    >
                        {description}
                    </Typography>
                    <Typography
                        variant={'caption'}
                        color={isGraded ? 'textPrimary' : 'textSecondary'}
                        className={classes.smallFont}
                    >
                        <span className={font.fontWeightMedium}>{isGraded ? 'Certificate #:' : 'Grade Pending'}</span>
                        {isGraded ? <span>{certification}</span> : null}
                    </Typography>
                </div>
            ) : null}
            {children}
        </LinkComponent>
    );
}

export default CardPreview;
