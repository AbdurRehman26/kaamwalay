import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
    onChange: (file: File | null) => void;
    profilePicMode?: boolean;
    maxHeight?: string;
    maxWidth?: string;
    isSmall?: boolean;
    accept?: string;
    imageUrl?: any;
    onDelete?: () => void;
}

const useStyles = makeStyles(
    () => ({
        uploadedImage: {
            maxWidth: '210px',
            maxHeight: '176px',
            marginTop: '6px',
            imageRendering: 'pixelated',
        },
    }),
    { name: 'ImageUploader' },
);

export default function ImageUploader(props: ImageUploaderProps) {
    const { accept = 'image/*' } = props;
    const classes = useStyles();
    const [uploadedImage, setUploadedImage] = useState(null);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const onDrop = useCallback(
        (acceptedFiles) => {
            setUploadedImage(acceptedFiles[acceptedFiles.length - 1]);
            props.onChange(acceptedFiles[acceptedFiles.length - 1]);
        },
        [props],
    );
    const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
        accept: accept,
        onDrop,
    } as DropzoneOptions);

    const deleteImage = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setUploadedImage(null);
            props.onChange(null);
            props.onDelete?.();
        },
        [props],
    );

    const replaceImage = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (inputRef?.current !== null) {
                inputRef.current.click();
            }
        },
        [inputRef],
    );

    if (uploadedImage || props.imageUrl) {
        return (
            <Box
                sx={{ backgroundColor: '#F9F9F9', border: '1px solid #E0E0E0' }}
                minWidth={props.maxWidth ? props.maxWidth : '214px'}
                minHeight={props.maxHeight ? props.maxHeight : '214px'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'space-between'}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <img
                    src={uploadedImage ? URL.createObjectURL(uploadedImage) : props.imageUrl}
                    alt=""
                    className={classes.uploadedImage}
                    style={{
                        maxHeight: props.maxHeight ? props.maxHeight : '176px',
                        maxWidth: props.maxWidth ? props.maxWidth : '210px',
                    }}
                />
                <ButtonGroup
                    size={props.isSmall ? 'small' : 'medium'}
                    sx={{
                        marginTop: '6px',
                        marginBottom: '6px',
                        backgroundColor: props.isSmall ? '#F9F9F9' : '#20BFB8',
                        border: props.isSmall ? '1px solid #CCCCCC' : '',
                    }}
                >
                    <Button
                        sx={{
                            color: props.isSmall ? 'black' : 'white',
                            backgroundColor: props.isSmall ? '#F9F9F9' : '#20BFB8',
                            border: props.isSmall ? '1px solid #CCCCCC' : '',
                        }}
                        onClick={deleteImage}
                    >
                        Delete
                    </Button>
                    <Button
                        sx={{
                            color: props.isSmall ? 'black' : 'white',
                            backgroundColor: props.isSmall ? '#F9F9F9' : '#20BFB8',
                            border: props.isSmall ? '1px solid #CCCCCC' : '',
                        }}
                        onClick={replaceImage}
                    >
                        Replace
                    </Button>
                </ButtonGroup>
            </Box>
        );
    }

    if (props.profilePicMode) {
        return (
            <Box
                sx={{
                    cursor: 'pointer',
                }}
                bgcolor={'#F9F9F9'}
                border={'1px solid #E0E0E0'}
                minHeight={'254px'}
                minWidth={'100%'}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {!isDragActive ? (
                    <>
                        <FileUploadOutlinedIcon />
                        <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold' }}>
                            Upload Image
                        </Typography>
                        {!isSm ? <Typography variant={'subtitle1'}>or drag and drop</Typography> : null}
                    </>
                ) : (
                    <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold' }}>
                        Drop it
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                cursor: 'pointer',
                backgroundColor: '#F9F9F9',
                border: '1px solid #E0E0E0',
            }}
            minHeight={props.maxHeight ? props.maxHeight : '176px'}
            minWidth={props.maxWidth ? props.maxWidth : '214px'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            {!isDragActive ? (
                <>
                    <FileUploadOutlinedIcon />
                    <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold' }}>
                        Upload Image
                    </Typography>
                    {!isSm ? <Typography variant={'subtitle1'}>or drag and drop</Typography> : null}
                </>
            ) : (
                <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold' }}>
                    Drop it
                </Typography>
            )}
        </Box>
    );
}
