import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import NotesDialog from '@shared/components/NotesDialog/NotesDialog';
import { OptionsMenu, OptionsMenuItem } from '@shared/components/OptionsMenu';
import { OrderItemStatusEnum } from '@shared/constants/OrderItemStatusEnum';
import { getStringTruncated } from '@shared/lib/utils/getStringTruncated';
import { getCardLabel, setEditLabelDialog } from '@shared/redux/slices/adminOrderLabelsSlice';
import { OrderStatusEnum } from '../constants/OrderStatusEnum';
import { RolesEnum } from '../constants/RolesEnum';
import { OrderItemEntity } from '../entities/OrderItemEntity';
import { useAuth } from '../hooks/useAuth';
import { cx } from '../lib/utils/cx';
import { formatCurrency } from '../lib/utils/formatCurrency';
import font from '../styles/font.module.css';

enum RowOption {
    EditLabel,
}
interface SubmissionViewCardsProps {
    items: OrderItemEntity[];
    serviceLevelPrice: number;
    orderStatusID?: number;
}

export const useStyles = makeStyles(
    (theme) => ({
        containerBox: {
            padding: 0,
            [theme.breakpoints.down('sm')]: {
                maxWidth: '98%',
            },
        },
        root: {
            marginTop: theme.spacing(4),
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            '& $header, & $footer': {
                backgroundColor: '#f9f9f9',
            },
        },
        header: {},
        footer: {},
        gutterRight: {
            marginRight: theme.spacing(1),
        },
        cardImage: {
            width: 40,
            height: 56,
            objectFit: 'contain',
            objectPosition: 'center center',
        },
        gradeBadge: {
            width: 36,
            height: 36,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: 18,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        viewGradeText: {
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'center',
            letterSpacing: '0.35px',
            color: '#20BFB8',
            textDecoration: 'none',
        },
        shortName: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '10px',
            lineHeight: '14px',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.54)',
        },
        cardDataKeyText: {
            fontWeight: 'bold',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        cardDataKeyValue: {
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        gradeColumn: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
    }),
    { name: 'SubmissionViewCards' },
);

export function SubmissionViewCards({ items, serviceLevelPrice, orderStatusID }: SubmissionViewCardsProps) {
    const classes = useStyles();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    // TODO: replace with a dedicated hook `useUser`
    const { user } = useAuth();
    const GradeRoot = isMobile ? 'a' : Box;
    const [openNotesModal, setOpenNotesModal] = useState(false);
    const [notes, setNotes] = useState('');

    const handleOption = useCallback(
        async (action: RowOption, id: number) => {
            switch (action) {
                case RowOption.EditLabel:
                    await dispatch(getCardLabel({ id }));
                    dispatch(setEditLabelDialog(true));
                    break;
            }
        },
        [dispatch],
    );
    return (
        <Box px={3} className={classes.containerBox}>
            <NotesDialog
                heading={'Notes'}
                description={notes}
                open={openNotesModal}
                onClose={() => setOpenNotesModal(false)}
            />
            <TableContainer className={classes.root}>
                <Table>
                    <TableHead className={classes.header}>
                        <TableRow>
                            <TableCell variant={'head'}>Card</TableCell>
                            <TableCell variant={'head'}>Grade</TableCell>
                            {isMobile ? null : (
                                <>
                                    <TableCell variant={'head'}>Value (USD)</TableCell>
                                    <TableCell variant={'head'} align={'right'}>
                                        Paid
                                    </TableCell>
                                </>
                            )}
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Box display={'flex'} alignItems={'center'}>
                                        <img
                                            src={item.cardProduct?.imagePath}
                                            className={classes.cardImage}
                                            alt={item.cardProduct?.imagePath}
                                        />
                                        <Box display={'flex'} flexDirection={'column'} paddingLeft={1}>
                                            <Typography variant={'body2'}>{item.cardProduct?.getName()}</Typography>
                                            <div title={item.cardProduct?.getShortName()}>
                                                <Typography variant={'subtitle2'} className={classes.shortName}>
                                                    {getStringTruncated(item.cardProduct?.getShortName() || '', 65)}
                                                </Typography>
                                            </div>
                                            <Typography variant={'body2'}>{item.cardProduct?.getLongName()}</Typography>

                                            {!isMobile ? (
                                                <Box>
                                                    <Typography
                                                        variant={'caption'}
                                                        color={'textSecondary'}
                                                        className={classes.gutterRight}
                                                    >
                                                        Card #: {item.cardProduct?.cardNumberOrder}
                                                    </Typography>
                                                    <Typography
                                                        variant={'caption'}
                                                        color={'textSecondary'}
                                                        className={classes.gutterRight}
                                                    >
                                                        ID: {item.id}
                                                    </Typography>
                                                    {item.userCard?.certificateNumber ? (
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.gutterRight}
                                                        >
                                                            Certificate #: {item.userCard?.certificateNumber}
                                                        </Typography>
                                                    ) : null}
                                                </Box>
                                            ) : null}

                                            {!isMobile ? null : (
                                                <>
                                                    <Box>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyText}
                                                        >
                                                            Card ID:
                                                        </Typography>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyValue}
                                                        >
                                                            &nbsp;{item.id}
                                                        </Typography>
                                                    </Box>

                                                    {item.userCard?.certificateNumber ? (
                                                        <Box>
                                                            <Typography
                                                                variant={'caption'}
                                                                color={'textSecondary'}
                                                                className={classes.cardDataKeyText}
                                                            >
                                                                Certificate ID:
                                                            </Typography>
                                                            <Typography
                                                                variant={'caption'}
                                                                color={'textSecondary'}
                                                                className={classes.cardDataKeyValue}
                                                            >
                                                                &nbsp;{item.userCard?.certificateNumber}
                                                            </Typography>
                                                        </Box>
                                                    ) : null}

                                                    <Box>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyText}
                                                        >
                                                            Value (USD):
                                                        </Typography>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyValue}
                                                        >
                                                            &nbsp;{formatCurrency(item.declaredValuePerUnit)}
                                                        </Typography>
                                                    </Box>

                                                    <Box>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyText}
                                                        >
                                                            Paid:
                                                        </Typography>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyValue}
                                                        >
                                                            &nbsp;{formatCurrency(serviceLevelPrice)}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {(orderStatusID === OrderStatusEnum.GRADED ||
                                        orderStatusID === OrderStatusEnum.ASSEMBLED ||
                                        orderStatusID === OrderStatusEnum.SHIPPED) &&
                                    item?.userCard?.overallGrade !== '0' &&
                                    item?.userCard?.overallGradeNickname ? (
                                        <GradeRoot
                                            target={'_blank'}
                                            href={`/feed/${item.userCard?.certificateNumber}/view`}
                                            flexDirection={'column'}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            {item?.userCard?.overallGrade ? (
                                                <div>
                                                    <Typography
                                                        variant={'body2'}
                                                        className={cx(
                                                            font.fontWeightBold,
                                                            isMobile ? classes.gradeBadge : null,
                                                        )}
                                                    >
                                                        {item?.userCard?.overallGrade}
                                                    </Typography>
                                                </div>
                                            ) : (
                                                '-'
                                            )}

                                            {isMobile ? null : (
                                                <div className={classes.gradeColumn}>
                                                    {user.hasRole(RolesEnum.Admin) && (
                                                        <MuiLink
                                                            href={`/admin/submissions/${item.orderId}/grade?item_id=${item.id}`}
                                                            rel={'noreferrer'}
                                                            underline={'hover'}
                                                            variant={'body2'}
                                                            className={classes.viewGradeText}
                                                        >
                                                            Revise Grade
                                                        </MuiLink>
                                                    )}

                                                    {item?.userCard?.overallGrade ? (
                                                        <MuiLink
                                                            target={'_blank'}
                                                            href={`/feed/${item.userCard?.certificateNumber}/view`}
                                                            rel={'noreferrer'}
                                                            underline={'hover'}
                                                            variant={'body2'}
                                                            className={classes.viewGradeText}
                                                        >
                                                            View Grade
                                                        </MuiLink>
                                                    ) : null}
                                                </div>
                                            )}
                                        </GradeRoot>
                                    ) : item.status.orderItemStatus.id === OrderItemStatusEnum.NOT_ACCEPTED ||
                                      item.status.orderItemStatus.id === OrderItemStatusEnum.MISSING ? (
                                        <>
                                            {item.status.orderItemStatus.name}
                                            <br />
                                            {item.notes && (
                                                <MuiLink
                                                    href={'#'}
                                                    rel={'noreferrer'}
                                                    underline={'hover'}
                                                    variant={'body2'}
                                                    className={classes.viewGradeText}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setNotes(item.notes);
                                                        setOpenNotesModal(true);
                                                    }}
                                                >
                                                    View Notes
                                                </MuiLink>
                                            )}
                                        </>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                {isMobile ? null : (
                                    <>
                                        <TableCell>
                                            <Typography variant={'body2'}>
                                                {formatCurrency(item.declaredValuePerUnit)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <Typography variant={'body2'}>
                                                {formatCurrency(serviceLevelPrice)}
                                            </Typography>
                                        </TableCell>
                                    </>
                                )}
                                <TableCell>
                                    {user.hasRole(RolesEnum.Admin) && (
                                        <OptionsMenu onClick={handleOption}>
                                            <OptionsMenuItem action={RowOption.EditLabel} value={item.cardProduct?.id}>
                                                Edit Label Text
                                            </OptionsMenuItem>
                                        </OptionsMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default SubmissionViewCards;
