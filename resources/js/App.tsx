import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import NewSubmissionPage from "./Pages/NewSubmissionPage";
import SubmissionsPage from "./Pages/SubmissionsPage";
import YourCardsPage from "./Pages/YourCardsPage";
import ProfilePage from "./Pages/ProfilePage";
import SavedCreditCardsPage from "./Pages/SavedCreditCardsPage";
import AddressBookPage from "./Pages/AddressBookPage";

import Layout from "./Components/Layout";

function App() {
  return (
   <Router>
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
