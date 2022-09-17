import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';

interface MoreActionProps {
    id: number;
    handleEditAction(id: number): void;
    handleDeleteAction(id: number): void;
}

function MoreAction(props: MoreActionProps) {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleEdit(id: number) {
        props.handleEditAction(id);
        setAnchorEl(null);
    }

    function handleDelete(id: number) {
        props.handleDeleteAction(id);
        setAnchorEl(null);
    }

    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreIcon />
            </IconButton>
            <Menu id="card-actions-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => handleEdit(props.id)}>Edit</MenuItem>
                <MenuItem onClick={() => handleDelete(props.id)}>Delete</MenuItem>
            </Menu>
        </>
    );
}

export default MoreAction;
