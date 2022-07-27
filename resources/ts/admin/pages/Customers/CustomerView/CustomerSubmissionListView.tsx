import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const Root = styled(Grid)({
    boxSizing: 'border-box',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    margin: '20px',
    '.CustomerDetailBox': {
        boxSizing: 'border-box',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        margin: '20px',
        padding: '20px',
    },
});

export function CustomerSubmissionListView() {
    return <Root container></Root>;
}

export default CustomerSubmissionListView;
