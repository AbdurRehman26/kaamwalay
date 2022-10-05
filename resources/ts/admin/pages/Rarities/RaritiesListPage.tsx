// import { RaritiesPageHeader } from './RaritiesPageHeader';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import { Form, Formik, FormikProps } from 'formik';
// import { PageSelector } from '@shared/components/PageSelector';
// import React, { useMemo } from 'react';

// type InitialValues = {
//     cardCategory: string;
//     search: string;
// };

// export function RaritiesListPage() {

//     const initialValues = useMemo<InitialValues>(
//         () => ({
//             // cardCategory: query.cardCategory ?? '',
//             // search: query.search ?? '',
//         }),
//         // [query.search, query.cardCategory],
//     );

//     return (
//         <>
//             <RaritiesPageHeader searchField title='Add Rarities' />
//             <Grid container p={2.5} alignItems={'center'}>
//                             <Grid item xs container alignItems={'center'}>
//                                 <Typography variant={'subtitle1'}>
//                                     {/* {cards.pagination.meta.total} */}
//                                      Result(s)</Typography>
//                                 <Formik initialValues={initialValues} onSubmit={handleSubmit} innerRef={formikRef}>
//                                     {({ values }) => (
//                                         <Grid item xs ml={2} display={'flex'} alignItems={'center'}>
//                                             <PageSelector
//                                                 label={'Categories'}
//                                                 // value={categoryName.categoryName}
//                                                 // onClear={handleClearCategory}
//                                             >
//                                                 {/* {availableCategories?.map((item: any) => {
//                                                     return (
//                                                         <Grid key={item.id}>
//                                                             <MenuItem
//                                                                 onClick={() => handleCategory(values, item)}
//                                                                 key={item.id}
//                                                                 value={item.id}
//                                                             >
//                                                                 {item.name}
//                                                             </MenuItem>
//                                                         </Grid>
//                                                     );
//                                                 })} */}
//                                             </PageSelector>
//                                         </Grid>
//                                     )}
//                                 </Formik>
//                             </Grid>
//                         </Grid>
//         </>
//     );
// }

// export default RaritiesListPage;
