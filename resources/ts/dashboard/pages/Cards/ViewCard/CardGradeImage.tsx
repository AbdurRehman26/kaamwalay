import ButtonBase, { ButtonBaseProps } from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';

import { cx } from '@shared/lib/utils/cx';

import { CardPreview } from '@dashboard/components/CardPreview';

interface CardGradeImageProps extends Omit<ButtonBaseProps, 'onClick'> {
    image: string;
    index: number;
    onClick: (event: any, index: number) => any;
}

const useStyles = makeStyles(
    () => ({
        root: {
            width: '100%',
            padding: 4,
        },
        image: {
            width: '100%',
            height: 'auto',
        },
        caption: {
            padding: '10px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        captionText: {
            color: '#fff',
            fontWeight: 500,
        },
    }),
    {
        name: 'CardGradeImage',
    },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: CardGradeImage
 * @date: 11.08.2021
 * @time: 20:24
 */
export function CardGradeImage({
    image,
    title,
    index,
    onClick,
    className,
    classes: componentClasses,
    ...rest
}: CardGradeImageProps) {
    const classes = useStyles();
    const handleClick = useCallback((event) => onClick(event, index), [onClick, index]);
    return (
        <ButtonBase onClick={handleClick} className={cx(classes.root, componentClasses?.root, className)} {...rest}>
            <CardPreview image={image} onlyImage>
                <div className={classes.caption}>
                    <Typography variant={'body2'} className={classes.captionText} align={'left'}>
                        {title}
                    </Typography>
                </div>
            </CardPreview>
        </ButtonBase>
    );
}

export default CardGradeImage;
