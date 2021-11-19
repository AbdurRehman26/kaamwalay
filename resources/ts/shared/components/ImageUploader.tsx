import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { ButtonGroup, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';

interface ImageUploaderProps {
    onChange: (file: File | null) => void;
}

export default function ImageUploader(props: ImageUploaderProps) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const onDrop = useCallback(
        (acceptedFiles: any) => {
            setUploadedImage(acceptedFiles[acceptedFiles.length - 1]);
            props.onChange(acceptedFiles[acceptedFiles.length - 1]);
        },
        [uploadedImage],
    );
    const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({ accept: 'image/*', onDrop });

    const deleteImage = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setUploadedImage(null);
            props.onChange(null);
        },
        [uploadedImage],
    );

    const replaceImage = useCallback(
        (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (inputRef?.current !== null) {
                inputRef.current.click();
            }
        },
        [uploadedImage],
    );

    if (uploadedImage) {
        return (
            <Box
                sx={{ backgroundColor: '#F9F9F9', border: '1px solid #E0E0E0', minHeight: '214px', minWidth: '214px' }}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt=""
                    style={{ maxWidth: '210px', maxHeight: '176px', marginTop: '6px', imageRendering: 'pixelated' }}
                />
                <ButtonGroup variant="contained" sx={{ marginTop: '6px', marginBottom: '6px' }}>
                    <Button onClick={deleteImage}>Delete</Button>
                    <Button onClick={replaceImage}>Replace</Button>
                </ButtonGroup>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                cursor: 'pointer',
                backgroundColor: '#F9F9F9',
                border: '1px solid #E0E0E0',
                minHeight: '214px',
                minWidth: '214px',
            }}
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
                    Drop it{' '}
                    <span role={'img'} aria-label={'Wink Emoji'}>
                        😉
                    </span>
                    <span role={'img'} aria-label={'Fire Emoji'}>
                        {' '}
                        🔥
                    </span>
                </Typography>
            )}
        </Box>
    );
}
