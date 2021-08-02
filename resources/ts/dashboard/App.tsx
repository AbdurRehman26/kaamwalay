import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Layout from './components/Layout';
import AddressBookPage from './pages/AddressBookPage';
import NewSubmissionPage from './pages/NewSubmissionPage';
import ProfilePage from './pages/ProfilePage';
import SavedCreditCardsPage from './pages/SavedCreditCardsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import YourCardsPage from './pages/YourCardsPage';

function App() {
    return (
        <Router basename={'/dashboard'}>
            <Layout>
                <Switch>
                    <Route path={'/new-submission'} exact component={NewSubmissionPage} />
                    <Route path={'/your-cards'} exact component={YourCardsPage} />
                    <Route path={'/profile'} exact component={ProfilePage} />
                    <Route path={'/saved-credit-cards'} exact component={SavedCreditCardsPage} />
                    <Route path={'/address-book'} exact component={AddressBookPage} />
                    <Route path={'/submissions'} exact component={SubmissionsPage} />
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
