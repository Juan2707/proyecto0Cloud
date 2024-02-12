import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Tareas from './Tareas';
import Registro from './Registro';
import BotonLogOut from './BotonLogOut';
import FormularioTarea from './formularioTarea';
import FormularioCategoria from './formularioCategoria';
import Categorias from './Categorias';
import TareaDetalle from './TareaDetalle';
import EditarTarea from './EditarTarea';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/registro" component={Registro} />
            <PrivateRoute path="/editar_tarea/:id" component={EditarTarea}/>
            <PrivateRoute path="/tareas/crear" component={FormularioTarea}/>
            <PrivateRoute path="/tareas/:tareaId" component={TareaDetalle}/>
            <PrivateRoute path="/tareas" component={Tareas} />
            <PrivateRoute path="/categorias/crear" component={FormularioCategoria} />
            <PrivateRoute path="/categorias" component={Categorias} />
            <Route path="/" exact>
              <Redirect to="/login" />
            </Route>
          </Switch>
          <BotonLogOut />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
