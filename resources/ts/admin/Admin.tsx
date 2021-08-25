import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { Layout } from './components/Layout';
import {Main} from './pages/Main';
import {Submissions} from './pages/Submissions';

export function Admin() {
    return (
        <Layout>
            <Switch>
                <Route exact path={'/'} component={Main}/>
                <Route exact path={'/submissions'} component={Submissions}/>
            </Switch>
        </Layout>
    );
}
