import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import MaterialUiPhoneNumber from 'material-ui-phone-number';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ImageUploader from '@shared/components/ImageUploader';
import { UpdateSalesRepRequestDto } from '@shared/dto/UpdateSalesRepRequestDto';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { useCountriesListsQuery } from '@shared/redux/hooks/useCountriesQuery';
import { updateSalesRep } from '@shared/redux/slices/adminSalesRepSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';

interface SalesRepUpdateDialogProps extends Omit<DialogProps, 'onSubmit'> {
    onSubmit?(): Promise<void> | void;
}

const Root = styled(Dialog)(({ theme }) => ({
    '.MuiDialog-paper': {
        minWidth: 720,
    },
    '.MuiDialogContent-root': {
        padding: '0px 24px 20px 24px !important',
    },
    '.MuiDialogActions-root': {
        padding: '18px 24px',
        '.MuiButton-contained': {
            padding: '10px 18px',
            borderRadius: 2,
            marginLeft: theme.spacing(3),
        },
    },
}));

const RadioContainer = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start !important',
    width: '100%',
    height: '72px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 2,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    '&.selected': {
        '.MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
    },
}));

const StyledPhoneNumber = styled(MaterialUiPhoneNumber)(() => ({
    '&': {
        padding: '8px 14px !important',
        width: '100%',
        border: '1px solid lightgray',
        fontWeight: 400,
        fontSize: '1rem',
        borderRadius: 4,
    },
    '.MuiInput-input': {
        borderLeft: '1px solid lightgray',
        padding: '7px 5px !important',
    },
    '.MuiInput-root:before': {
        border: '0 !important',
    },
    '.MuiInput-root:after': {
        border: '0 !important',
    },
}));

const useStyles = makeStyles(
    () => {
        return {
            textField: {
                height: 48,
                radius: 4,
            },
            label: {
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '16px',
            },
        };
    },
    { name: '' },
);

export function SalesRepUpdateDialog({ onClose, onSubmit, ...rest }: SalesRepUpdateDialogProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [commissionType, setCommissionType] = useState(true);
    const [emailExist, setEmailExist] = useState(false);
    const [commissionValue, setCommissionValue] = useState(0);
    const [listActive, setListActive] = useState(true);
    const [profileImage, setProfileImage] = useState('');
    const filesRepository = useRepository(FilesRepository);
    const { data } = useCountriesListsQuery();
    const salesRep = useAppSelector((state) => state.adminSalesRep.salesRep);

    useEffect(() => {
        setFirstName(salesRep.firstName);
        setLastName(salesRep.lastName);
        setEmail(salesRep.email);
        setPhone(salesRep.phone);
        setCommissionType(!!Number(salesRep.commissionType));
        setCommissionValue(salesRep.commissionValue);
        setListActive(!!salesRep.status);
        setProfileImage(salesRep.profileImage);
    }, [salesRep]);

    const handleClose = useCallback(
        (event: {}) => {
            if (onClose) {
                onClose(event, 'escapeKeyDown');
            }
        },
        [onClose],
    );

    const handleAddSalesRep = async () => {
        let profileImageDTO = profileImage;
        if (uploadedImage) {
            profileImageDTO = await filesRepository.uploadFile(uploadedImage);
        }
        const salesRepInput: UpdateSalesRepRequestDto = {
            profileImage: profileImageDTO,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            commissionType: commissionType ? 1 : 0,
            commissionValue: commissionValue,
            isActive: listActive,
        };
        try {
            setLoading(true);
            const data = await dispatch(updateSalesRep({ id: salesRep.id, DTO: salesRepInput }));
            if (!data?.error) {
                onSubmit?.();
            } else {
                setEmailExist(true);
            }
        } catch (e: any) {
            notifications.exception(e);
            return;
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProfileImage = useCallback(() => {
        setProfileImage('');
    }, []);

    useEffect(() => {
        const parsedName = parseName(salesRep?.fullName);
        if (salesRep.email) {
            setEmail(salesRep?.email);
            setFirstName(parsedName?.firstName);
            setLastName(parsedName?.lastName);
        }
    }, [salesRep]);

    const handleCommissionType = () => {
        setCommissionType(!commissionType);
        setCommissionValue(0);
    };

    const parseName = (fullName: any) => {
        const value = fullName?.trim() ?? '';
        const firstSpace = value.indexOf(' ');
        if (firstSpace === -1) {
            return { firstName: value, lastName: null };
        }

        const firstName = value.slice(0, firstSpace);
        const lastName = value.slice(firstSpace + 1);

        return { firstName, lastName };
    };

    const isValid = useMemo(() => {
        return !!(firstName && lastName && email && commissionType !== null && commissionValue && listActive !== null);
    }, [firstName, lastName, email, commissionType, commissionValue, listActive]);

    return (
        <Root onClose={handleClose} {...rest}>
            <Grid container alignItems={'center'} justifyContent={'space-between'} py={2} pl={3} pr={2}>
                <Grid item xs container alignItems={'center'} justifyContent={'flex-start'}>
                    <Typography variant={'h6'} fontWeight={400}>
                        Update Sales Rep{' '}
                    </Typography>
                </Grid>

                <Grid item xs container alignItems={'center'} justifyContent={'flex-end'}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider />
            <DialogContent>
                <Grid container item display={'flex'} justifyContent={'space-between'} flexWrap={'nowrap'} my={2}>
                    <Grid md={4} m={1}>
                        <Typography variant={'subtitle1'} className={classes.label}>
                            Profile Picture
                        </Typography>
                        <ImageUploader
                            maxHeight="230px"
                            maxWidth="213px"
                            onChange={(img) => setUploadedImage(img)}
                            onDelete={handleRemoveProfileImage}
                            imageUrl={profileImage}
                        />
                    </Grid>
                    <Grid md={8} m={1}>
                        <Grid display={'flex'} flexWrap={'nowrap'}>
                            <Grid md={6} mr={0.5}>
                                <Typography variant={'subtitle1'} className={classes.label}>
                                    First Name*
                                </Typography>
                                <TextField
                                    onChange={(e) => setFirstName(e.target.value)}
                                    name={'firstName'}
                                    className={classes.textField}
                                    placeholder={'Enter First Name'}
                                    variant="outlined"
                                    value={firstName}
                                />
                            </Grid>
                            <Grid md={6} ml={0.5}>
                                <Typography variant={'subtitle1'} className={classes.label}>
                                    Last Name*
                                </Typography>
                                <TextField
                                    onChange={(e) => setLastName(e.target.value)}
                                    name={'lastName'}
                                    className={classes.textField}
                                    placeholder={'Enter Last Name'}
                                    variant="outlined"
                                    value={lastName}
                                />
                            </Grid>
                        </Grid>
                        <Grid>
                            <Typography variant={'subtitle1'} className={classes.label} sx={{ marginTop: '22px' }}>
                                Email*
                            </Typography>
                            <TextField
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                                name={'email'}
                                disabled={true}
                                className={classes.textField}
                                placeholder={'Enter Email'}
                                variant="outlined"
                                value={email}
                            />
                        </Grid>
                        <Grid>
                            <Typography
                                variant={'subtitle1'}
                                className={classes.label}
                                sx={{ marginTop: emailExist ? '0' : '22px' }}
                            >
                                Phone Number
                            </Typography>
                            <StyledPhoneNumber
                                countryCodeEditable={false}
                                defaultCountry="us"
                                disableAreaCodes
                                value={phone}
                                onlyCountries={data.map((country) => country.code.toLowerCase())}
                                onChange={(e) => setPhone(e.toString())}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Divider></Divider>
                <Grid mt={2} container>
                    <Typography variant={'body1'} fontWeight={500}>
                        Sales Commission Structure
                    </Typography>
                    <RadioContainer>
                        <div
                            style={{ display: 'flex', alignItems: 'center', width: '80%' }}
                            onClick={handleCommissionType}
                            aria-hidden={true}
                        >
                            <Radio checked={commissionType} />
                            <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                Fixed Amount Per Card
                            </Typography>
                        </div>
                        {commissionType ? (
                            <>
                                <TextField
                                    onChange={(e) => setCommissionValue(Number(e.target.value))}
                                    value={commissionValue}
                                    size="small"
                                    type={'number'}
                                    id="formatted-numberformat-input"
                                    variant="outlined"
                                    InputProps={{
                                        inputProps: { min: 1 },
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    sx={{ width: '80px', marginLeft: 'auto', marginRight: '5px' }}
                                />
                                <Typography>/ Card</Typography>
                            </>
                        ) : null}
                    </RadioContainer>
                    <RadioContainer>
                        <div
                            style={{ display: 'flex', alignItems: 'center', width: '80%' }}
                            onClick={handleCommissionType}
                            aria-hidden={true}
                        >
                            <Radio checked={!commissionType} />
                            <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                Percent of Order Total
                            </Typography>
                        </div>
                        {!commissionType ? (
                            <>
                                <TextField
                                    onChange={(e) => setCommissionValue(Number(e.target.value))}
                                    value={commissionValue}
                                    type={'number'}
                                    size="small"
                                    id="formatted-numberformat-input"
                                    variant="outlined"
                                    InputProps={{
                                        inputProps: { min: 1 },
                                        startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    sx={{ width: '80px', marginLeft: 'auto', marginRight: '5px' }}
                                />
                                <Typography>/ Card</Typography>{' '}
                            </>
                        ) : null}
                    </RadioContainer>
                    <FormControlLabel
                        sx={{ marginLeft: 'auto', marginTop: '8px' }}
                        labelPlacement={'start'}
                        control={
                            <Switch checked={listActive} onChange={() => setListActive(!listActive)} name="isActive" />
                        }
                        label="List as Active"
                    />
                </Grid>
            </DialogContent>
            <Divider></Divider>
            <DialogActions>
                <Button onClick={handleClose} color={'inherit'}>
                    Cancel
                </Button>
                <LoadingButton
                    type={'submit'}
                    onClick={handleAddSalesRep}
                    loading={loading}
                    disabled={!isValid}
                    variant={'contained'}
                >
                    {'Update Sales Rep'}
                </LoadingButton>
            </DialogActions>
        </Root>
    );
}
