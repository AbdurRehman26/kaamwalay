import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";

type SidebarMenuItemProps = {
    icon: any;
    activeIcon: any;
    active: boolean;
    title: string;
    link: string;
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '48px',
        backgroundColor: ({active}: any) => active ? '#E9FFFE' : '#fff',
        marginTop: '6px',
        marginBottom: '6px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '12px',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: ({active}: any) => active ? '#20BFB8' : '#fff',
        boxSizing: 'border-box',
        "&:hover": {
            backgroundColor: '#dbe0e0',
            borderLeftColor: '#20807b',
            cursor: 'pointer',
        },
    },
    iconContainer: {

    },
    titleContainer: {
        marginLeft: '12px',
    },
    title: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    activeTitle: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.2px",
        color: "#20BFB8"
    }
})
function SideBarMenuItem(props: SidebarMenuItemProps) {

    const {icon, activeIcon, active, title, link} = props;

    const classes = useStyles(props);

    return (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <div className={classes.root}>
                <div className={classes.iconContainer}>
                    {active ? activeIcon : icon}
                </div>
                <div className={classes.titleContainer}>
                    <Typography variant={'subtitle2'} className={active ? classes.activeTitle : classes.title}>{title}</Typography>
                </div>
            </div>
        </Link>

    )
}

export default SideBarMenuItem;
