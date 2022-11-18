import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Configuracoes from './Pages/configuracao';
import Feedback from './Pages/Feedback';
import Login from './Pages/Login';
import Game from './Pages/Game';
import Ranking from './Pages/ranking';
import './App.css';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/play" component={ Game } />
      <Route path="/configuracoes" component={ Configuracoes } />
      <Route path="/feedback" component={ Feedback } />
      <Route path="/ranking" component={ Ranking } />
    </Switch>
  );
}
