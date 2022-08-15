export default interface EnhancedTableHeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    align: 'right' | 'left';
    sortable: boolean;
}
