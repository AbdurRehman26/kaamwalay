import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Admin } from './Admin';
import { Layout } from './components/Layout';

function App() {
    return (
        <BrowserRouter basename={'/admin'}>
            <Layout>
                <Switch>
                    <Route path={'/'} component={Admin} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
