import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import { CardRarityEntity } from '@shared/entities/CardRarityEntity';

interface MoreActionProps {
    rarity: CardRarityEntity;
    handleEditAction(rarity: CardRarityEntity): void;
}

function MoreAction(props: MoreActionProps) {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleEdit(rarity: CardRarityEntity) {
        props.handleEditAction(rarity);
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
                <MenuItem onClick={() => handleEdit(props.rarity)}>Edit</MenuItem>
            </Menu>
        </>
    );
}

export default MoreAction;
