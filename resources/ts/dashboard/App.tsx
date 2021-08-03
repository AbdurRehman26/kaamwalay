import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Dashboard } from './Dashboard';
import { Layout } from './components/Layout';

function App() {
    return (
        <BrowserRouter basename={'/dashboard'}>
            <Layout exclude={'/submissions/new'}>
                <Switch>
                    <Route path={'/'} component={Dashboard} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
